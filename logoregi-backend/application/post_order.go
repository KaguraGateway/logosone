package application

import (
	"context"
	"log"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
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
	OrderAt        synchro.Time[tz.UTC]
	ClientId       string
	SeatId         string
}

type PostOrder interface {
	Execute(ctx context.Context, param PostOrderParam) (*model.Order, *model.OrderTicket, error)
}

type postOrderUseCase struct {
	orderRepo         repository.OrderRepository
	orderItemRepo     repository.OrderItemRepository
	orderPaymentRepo  repository.PaymentRepository
	orderDiscountRepo repository.OrderDiscountRepository
	orderQS           OrderQueryService
	productQS         ProductQueryService
	coffeeBrewRepo    repository.ProductCoffeeBrewRepository
	discountRepo      repository.DiscountRepository
	orderTicketRepo   repository.OrderTicketRepository
	orderHookRepo     repository.OrderHookRepository
	stockRepo         repository.StockRepository
	txRepo            repository.TxRepository
}

func NewPostOrderUseCase(i *do.Injector) (PostOrder, error) {
	return &postOrderUseCase{
		orderRepo:         do.MustInvoke[repository.OrderRepository](i),
		orderPaymentRepo:  do.MustInvoke[repository.PaymentRepository](i),
		orderDiscountRepo: do.MustInvoke[repository.OrderDiscountRepository](i),
		orderItemRepo:     do.MustInvoke[repository.OrderItemRepository](i),
		orderQS:           do.MustInvoke[OrderQueryService](i),
		productQS:         do.MustInvoke[ProductQueryService](i),
		coffeeBrewRepo:    do.MustInvoke[repository.ProductCoffeeBrewRepository](i),
		discountRepo:      do.MustInvoke[repository.DiscountRepository](i),
		orderTicketRepo:   do.MustInvoke[repository.OrderTicketRepository](i),
		orderHookRepo:     do.MustInvoke[repository.OrderHookRepository](i),
		stockRepo:         do.MustInvoke[repository.StockRepository](i),
		txRepo:            do.MustInvoke[repository.TxRepository](i),
	}, nil
}

func (uc *postOrderUseCase) Execute(ctx context.Context, param PostOrderParam) (*model.Order, *model.OrderTicket, error) {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	var orderItems []model.OrderItem
	var updateStocks []*model.Stock
	for _, item := range param.OrderItems {
		product, err := uc.productQS.FindById(ctx, item.ProductId)
		if err != nil {
			return nil, nil, err
		}
		var orderItem *model.OrderItem
		// コーヒの場合とその他で処理が違うので分岐
		if len(item.CoffeeBrewId) == 0 {
			orderItem = model.NewOrderItem(*product, item.Quantity)
			// 在庫減らす
			if product.Stock != nil {
				// 在庫チェック
				if product.Stock.Quantity < int32(item.Quantity) {
					return nil, nil, ErrProductStockShortage
				}
				// 減らす
				product.Stock.Quantity = product.Stock.Quantity - int32(item.Quantity)
				updateStocks = append(updateStocks, product.Stock)
			}
		} else {
			coffeeBrew, err := uc.coffeeBrewRepo.FindById(ctx, item.CoffeeBrewId)
			if err != nil {
				return nil, nil, err
			}
			orderItem, err = model.NewOrderItemCoffee(*product, item.Quantity, *coffeeBrew)
			if err != nil {
				return nil, nil, err
			}
		}
		// 価格チェック
		if orderItem.GetProductAmount() != item.Amount {
			return nil, nil, ErrProductAmountDiff
		}
		orderItems = append(orderItems, *orderItem)
	}

	var discounts []model.Discount
	var orderDiscounts []*model.OrderDiscount
	for _, item := range param.OrderDiscounts {
		discount, err := uc.discountRepo.FindById(ctx, item.DiscountId)
		if err != nil {
			return nil, nil, err
		}
		// 価格チェック
		if discount.GetDiscountPrice() != item.DiscountPrice {
			return nil, nil, ErrDiscountPriceDiff
		}
		discounts = append(discounts, *discount)
		orderDiscounts = append(orderDiscounts, model.ReconstructOrderDiscount(item.Id, param.Id, item.DiscountId))
	}

	var order *model.Order
	var ticket *model.OrderTicket
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
			if err := uc.orderItemRepo.SaveTx(ctx, tx, order.GetId(), &item); err != nil {
				return err
			}
		}
		for _, item := range orderDiscounts {
			if err := uc.orderDiscountRepo.SaveTx(ctx, tx, item); err != nil {
				return err
			}
		}

		// 在庫減らす
		for _, item := range updateStocks {
			if err := uc.stockRepo.SaveTx(ctx, tx, item); err != nil {
				return err
			}
		}

		// Ticket発行
		t, err := uc.orderTicketRepo.Create(ctx, order.GetId())
		if err != nil {
			return err
		}
		ticket = t
		// Hook
		if err := uc.orderHookRepo.PostOrder(ctx, order, t); err != nil {
			log.Printf("failed to post order: %v", err)
		}

		return nil
	})
	if err != nil {
		log.Printf(err.Error())
		return nil, nil, err
	}

	return order, ticket, nil
}
