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
	ProductId    string
	CoffeeBrewId *string
	Quantity     uint
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
	orderRepo       repository.OrderRepository
	orderItemRepo   repository.OrderItemRepository
	orderTicketRepo repository.OrderTicketRepository
	txRepo          repository.TxRepository
	pubsubService   repository.SrvToSrvPubSubService
}

func NewPostOrderFromPosUseCase(i *do.Injector) (PostOrderFromPos, error) {
	return &PostOrderFromPosUseCase{
		orderRepo:       do.MustInvoke[repository.OrderRepository](i),
		orderItemRepo:   do.MustInvoke[repository.OrderItemRepository](i),
		orderTicketRepo: do.MustInvoke[repository.OrderTicketRepository](i),
		txRepo:          do.MustInvoke[repository.TxRepository](i),
		pubsubService:   do.MustInvoke[repository.SrvToSrvPubSubService](i),
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
			// 注文アイテムを保存
			for i := 0; i < int(item.Quantity); i++ {
				orderItem, err := model.NewOrderItem(param.OrderId, item.ProductId, item.CoffeeBrewId)
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
