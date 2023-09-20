package application

import (
	"context"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model/order"
	orderitem "github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model/order_item"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/repository"
	"github.com/cockroachdb/errors"
	"github.com/samber/do"
)

type PostOrderItemInput struct {
	ProductId    string
	CoffeeBrewId *string
	Quantity     uint
}

type PostOrderInput struct {
	OrderId    string
	OrderAt    synchro.Time[tz.UTC]
	OrderItems []PostOrderItemInput
	OrderType  order.OrderType
	TicketId   string
	TicketAddr string
	SeatName   string
}

type PostOrderFromPos interface {
	Execute(ctx context.Context, input *PostOrderInput) error
}

type postOrderFromPosUseCase struct {
	orderRepo       repository.OrderRepository
	orderItemRepo   repository.OrderItemRepository
	orderTicketRepo repository.OrderTicketRepository
	txRepo          repository.TxRepository
	pubsubService   repository.SrvToSrvPubSubService
}

func NewPostOrderFromPosUseCase(i *do.Injector) (PostOrderFromPos, error) {
	return &postOrderFromPosUseCase{
		orderRepo:       do.MustInvoke[repository.OrderRepository](i),
		orderItemRepo:   do.MustInvoke[repository.OrderItemRepository](i),
		orderTicketRepo: do.MustInvoke[repository.OrderTicketRepository](i),
		txRepo:          do.MustInvoke[repository.TxRepository](i),
		pubsubService:   do.MustInvoke[repository.SrvToSrvPubSubService](i),
	}, nil
}

func (u *postOrderFromPosUseCase) Execute(ctx context.Context, input *PostOrderInput) error {
	cctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	// 既知の注文かどうかを確認する
	if order, _ := u.orderRepo.FindById(cctx, input.OrderId); order != nil {
		return nil
	}

	// トランザクションを開始する
	err := u.txRepo.Transaction(cctx, func(ctx context.Context, tx interface{}) error {
		// 注文アイテムを保存する
		var orderItems []orderitem.OrderItem
		for _, item := range input.OrderItems {
			// 注文アイテムを保存
			for i := 0; i < int(item.Quantity); i++ {
				orderItem, err := orderitem.NewOrderItem(input.OrderId, item.ProductId, item.CoffeeBrewId)
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
		order, err := order.NewOrder(input.OrderId, orderItems, input.OrderAt, input.OrderType, input.SeatName)
		if err != nil {
			return errors.Join(err, ErrInvalidParam)
		}
		if err := u.orderRepo.SaveTx(cctx, tx, order); err != nil {
			return err
		}

		// Ticketを保存する
		ticket, err := model.NewOrderTicket(input.OrderId, input.TicketId, input.TicketAddr)
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

	// 各サーバーに通知
	event, err := model.NewEvent("NewOrder", input.OrderId)
	if err != nil {
		return err
	}
	// TODO: Publish失敗した場合のエラー処理を考える
	if err := u.pubsubService.Publish(cctx, *event); err != nil {
		return err
	}

	return nil
}
