package application

import (
	"context"
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/samber/do"
)

type OrderItemParam struct {
	ProductId    string
	Quantity     uint64
	Amount       uint64
	CoffeeBrewId string
}

type OrderDiscountParam struct {
	Id            string
	DiscountId    string
	DiscountType  model.DiscountType
	DiscountPrice uint64
}

type PostOrderParam struct {
	Id             string
	OrderItems     []*OrderItemParam
	OrderDiscounts []*OrderDiscountParam
	OrderType      model.OrderType
	Payment        *OrderPaymentParam
	OrderAt        synchro.Time[tz.UTC]
	ClientId       string
	SeatId         string
}

type PostOrder interface {
	Execute(ctx context.Context, param PostOrderParam) (*model.Order, error)
}

type postOrderUseCase struct {
	orderRepo         repository.OrderRepository
	orderItemRepo     repository.OrderItemRepository
	orderPaymentRepo  repository.OrderPaymentRepository
	orderDiscountRepo repository.OrderDiscountRepository
	orderQS           OrderQueryService
	productQS         ProductQueryService
	coffeeBrewRepo    repository.ProductCoffeeBrewRepository
	discountRepo      repository.DiscountRepository
	txRepo            repository.TxRepository
}

func NewPostOrderUseCase(i *do.Injector) (PostOrder, error) {
	return &postOrderUseCase{
		orderRepo:         do.MustInvoke[repository.OrderRepository](i),
		orderPaymentRepo:  do.MustInvoke[repository.OrderPaymentRepository](i),
		orderDiscountRepo: do.MustInvoke[repository.OrderDiscountRepository](i),
		orderItemRepo:     do.MustInvoke[repository.OrderItemRepository](i),
		orderQS:           do.MustInvoke[OrderQueryService](i),
		productQS:         do.MustInvoke[ProductQueryService](i),
		coffeeBrewRepo:    do.MustInvoke[repository.ProductCoffeeBrewRepository](i),
		discountRepo:      do.MustInvoke[repository.DiscountRepository](i),
		txRepo:            do.MustInvoke[repository.TxRepository](i),
	}, nil
}

func (uc *postOrderUseCase) Execute(ctx context.Context, param PostOrderParam) (*model.Order, error) {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	var orderItems []model.OrderItem
	for _, item := range param.OrderItems {
		product, err := uc.productQS.FindById(ctx, item.ProductId)
		if err != nil {
			return nil, err
		}
		// コーヒの場合とその他で処理が違うので分岐
		if len(item.CoffeeBrewId) == 0 {
			// 価格チェック
			if amount, err := product.GetAmount(); err != nil {
				return nil, err
			} else if amount != item.Amount {
				return nil, ErrProductAmountDiff
			}
			orderItems = append(orderItems, *model.NewOrderItem(*product, item.Quantity))
		} else {
			coffeeBrew, err := uc.coffeeBrewRepo.FindById(ctx, item.CoffeeBrewId)
			if err != nil {
				return nil, err
			}
			// 価格チェック
			if item.Amount != coffeeBrew.Amount {
				return nil, ErrProductAmountDiff
			}
			if orderItem, err := model.NewOrderItemCoffee(*product, item.Quantity, *coffeeBrew); err != nil {
				return nil, err
			} else {
				orderItems = append(orderItems, *orderItem)
			}
		}
	}

	var discounts []model.Discount
	var orderDiscounts []*model.OrderDiscount
	for _, item := range param.OrderDiscounts {
		discount, err := uc.discountRepo.FindById(ctx, item.DiscountId)
		if err != nil {
			return nil, err
		}
		// 価格チェック
		if discount.GetDiscountPrice() != item.DiscountPrice {
			return nil, ErrDiscountPriceDiff
		}
		discounts = append(discounts, *discount)
		orderDiscounts = append(orderDiscounts, model.ReconstructOrderDiscount(item.Id, param.Id, item.DiscountId))
	}

	var order *model.Order
	// 以下、トランザクション処理
	err := uc.txRepo.Transaction(ctx, func(ctx context.Context, tx interface{}) error {
		// IDがない場合は新規作成, IDがある場合はそのIDを用いて作成
		if len(param.Id) == 0 {
			order = model.NewOrder(
				orderItems,
				discounts,
				param.OrderType,
				param.ClientId,
				param.SeatId)
		} else {
			order = model.ReconstructOrder(
				param.Id,
				orderItems,
				discounts,
				param.OrderType,
				nil,
				param.OrderAt,
				param.ClientId,
				param.SeatId,
			)
		}
		// 保存
		if err := uc.orderRepo.SaveTx(ctx, tx, order); err != nil {
			return err
		}
		for _, item := range order.GetOrderItems() {
			if err := uc.orderItemRepo.SaveTx(ctx, tx, &item); err != nil {
				return err
			}
		}
		for _, item := range orderDiscounts {
			if err := uc.orderDiscountRepo.SaveTx(ctx, tx, item); err != nil {
				return err
			}
		}
		// 支払い情報がある場合は保存
		if param.Payment != nil {
			payment := model.ReconstructOrderPayment(
				param.Payment.Id,
				order.GetId(),
				param.Payment.PaymentType,
				param.Payment.ReceiveAmount,
				param.Payment.PaymentAmount,
				param.Payment.PaymentAt,
				param.Payment.UpdatedAt,
			)
			// 入力側とお釣りに違いがないか
			if payment.GetChangeAmount() != param.Payment.ChangeAmount {
				return ErrPaymentChangeAmountDiff
			}
			if err := order.Pay(*payment); err != nil {
				return err
			}
			if err := uc.orderPaymentRepo.SaveTx(ctx, tx, payment); err != nil {
				return err
			}
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	return order, nil
}
