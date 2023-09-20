package application

import (
	"context"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/repository"
	"github.com/cockroachdb/errors"
	"github.com/samber/do"
)

type PostOrderItemParam struct {
	ProductId           string
	ProductName         string
	ProductType         model.ProductType
	ProductColor        string
	ProductCategoryId   string
	ProductCategoryName string
	CoffeeBrewId        *string
	CoffeeBrewName      *string
	Quantity            uint
}

type PostOrderParam struct {
	OrderId    string
	OrderAt    synchro.Time[tz.UTC]
	OrderItems []PostOrderItemParam
	OrderType  model.OrderType
	TicketId   string
	TicketAddr string
	SeatName   string
}

type PostOrderFromPos interface {
	Execute(ctx context.Context, param *PostOrderParam) error
}

type PostOrderFromPosUseCase struct {
	orderRepo             repository.OrderRepository
	orderItemRepo         repository.OrderItemRepository
	orderTicketRepo       repository.OrderTicketRepository
	productRepo           repository.ProductRepository
	productCategoryRepo   repository.ProductCategoryRepository
	productCoffeeBrewRepo repository.ProductCoffeeBrewRepository
	txRepo                repository.TxRepository
	pubsubService         repository.SrvToSrvPubSubService
}

func NewPostOrderFromPosUseCase(i *do.Injector) (PostOrderFromPos, error) {
	return &PostOrderFromPosUseCase{
		orderRepo:             do.MustInvoke[repository.OrderRepository](i),
		orderItemRepo:         do.MustInvoke[repository.OrderItemRepository](i),
		orderTicketRepo:       do.MustInvoke[repository.OrderTicketRepository](i),
		productRepo:           do.MustInvoke[repository.ProductRepository](i),
		productCategoryRepo:   do.MustInvoke[repository.ProductCategoryRepository](i),
		productCoffeeBrewRepo: do.MustInvoke[repository.ProductCoffeeBrewRepository](i),
		txRepo:                do.MustInvoke[repository.TxRepository](i),
		pubsubService:         do.MustInvoke[repository.SrvToSrvPubSubService](i),
	}, nil
}

func (u *PostOrderFromPosUseCase) Execute(ctx context.Context, param *PostOrderParam) error {
	cctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	// 既知の注文かどうかを確認する
	if order, _ := u.orderRepo.FindById(cctx, param.OrderId); order != nil {
		return nil
	}

	// トランザクションを開始する
	err := u.txRepo.Transaction(cctx, func(ctx context.Context, tx model.Tx) error {
		// 注文アイテムを保存する
		var orderItems []model.OrderItem
		for _, item := range param.OrderItems {
			// 商品を保存
			category, err := model.NewProductCategory(item.ProductCategoryId, item.ProductCategoryName)
			if err != nil {
				return errors.Join(err, ErrInvalidParam)
			}
			product, err := model.NewProduct(item.ProductId, item.ProductName, *category, item.ProductType, item.ProductColor)
			if err != nil {
				return errors.Join(err, ErrInvalidParam)
			}

			if err := u.productCategoryRepo.SaveTx(cctx, tx, category); err != nil {
				return err
			}
			if err := u.productRepo.SaveTx(cctx, tx, product); err != nil {
				return err
			}

			// コーヒー抽出方法を保存
			var coffeeBrew *model.ProductCoffeeBrew
			if item.CoffeeBrewId != nil && item.CoffeeBrewName != nil {
				if coffeeBrew, err = model.NewProductCoffeeBrew(*item.CoffeeBrewId, *item.CoffeeBrewName); err != nil {
					return errors.Join(err, ErrInvalidParam)
				}
				if err := u.productCoffeeBrewRepo.SaveTx(cctx, tx, coffeeBrew); err != nil {
					return err
				}
			}

			// 注文アイテムを保存
			for i := 0; i < int(item.Quantity); i++ {
				orderItem, err := model.NewOrderItem(param.OrderId, *product, coffeeBrew)
				if err != nil {
					return errors.Join(err, ErrInvalidParam)
				}
				if err := u.orderItemRepo.SaveTx(cctx, tx, orderItem); err != nil {
					return err
				}
				orderItems = append(orderItems, *orderItem)
			}
		}

		// 注文を保存する
		order, err := model.NewOrder(param.OrderId, orderItems, param.OrderAt, param.OrderType, param.SeatName)
		if err != nil {
			return errors.Join(err, ErrInvalidParam)
		}
		if err := u.orderRepo.SaveTx(cctx, tx, order); err != nil {
			return err
		}

		// Ticketを保存する
		ticket, err := model.NewOrderTicket(param.OrderId, param.TicketId, param.TicketAddr)
		if err != nil {
			return errors.Join(err, ErrInvalidParam)
		}
		if err := u.orderTicketRepo.SaveTx(cctx, tx, ticket); err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		return err
	}

	// Publish
	event, err := model.NewEvent("NewOrder", param.OrderId)
	if err != nil {
		return err
	}
	// TODO: Publish失敗した場合のエラー処理を考える
	if err := u.pubsubService.Publish(cctx, *event); err != nil {
		return err
	}

	return nil
}
