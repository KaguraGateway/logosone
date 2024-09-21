package application

import (
	"context"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
	orderitem "github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model/order_item"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/repository"
	"github.com/cockroachdb/errors"
	"github.com/samber/do"
	"github.com/samber/lo"
)

type OnReceiveOrder interface {
	Execute(ctx context.Context, orderId string) error
}

type onReceiveOrderUseCase struct {
	orderRepo  repository.OrderRepository
	ticketRepo repository.OrderTicketRepository
	pubsub     repository.SrvToClientPubService
}

func NewOnReceiveOrderUseCase(i *do.Injector) (OnReceiveOrder, error) {
	return &onReceiveOrderUseCase{
		orderRepo:  do.MustInvoke[repository.OrderRepository](i),
		ticketRepo: do.MustInvoke[repository.OrderTicketRepository](i),
		pubsub:     do.MustInvoke[repository.SrvToClientPubService](i),
	}, nil
}

func (u *onReceiveOrderUseCase) Execute(ctx context.Context, orderId string) error {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	// 既知の注文かどうかを確認する
	order, err := u.orderRepo.FindById(ctx, orderId)
	if err != nil {
		return errors.Join(err, ErrOrderNotFound)
	} else if order == nil {
		return ErrOrderNotFound
	}
	// Ticketを取得
	ticket, err := u.ticketRepo.FindByOrderId(ctx, order.Id())
	if err != nil {
		return errors.Join(err, ErrOrderTicketNotFound)
	} else if ticket == nil {
		return ErrOrderTicketNotFound
	}

	orderItemDtos := lo.Map(order.OrderItems(), func(item orderitem.OrderItem, _ int) NewOrderItemOutput {
		return NewOrderItemOutput{
			Id:           item.Id(),
			ProductId:    item.ProductId(),
			CoffeeBrewId: item.CoffeeBrewId(),
		}
	})
	orderDto := NewOrderOutput{
		OrderId:    order.Id(),
		OrderAt:    order.OrderAt(),
		OrderType:  uint(order.OrderType()),
		TicketAddr: ticket.TicketAddr(),
		SeatName:   order.SeatName(),
		OrderItems: orderItemDtos,
	}

	// Clientに通知
	event, err := model.NewEvent("NewOrder", orderDto)
	if err != nil {
		return err
	}
	return u.pubsub.Publish(ctx, *event)
}

type NewOrderOutput struct {
	OrderId    string
	OrderAt    synchro.Time[tz.UTC]
	OrderType  uint
	TicketAddr string
	SeatName   *string
	OrderItems []NewOrderItemOutput
}

type NewOrderItemOutput struct {
	Id           string
	ProductId    string
	CoffeeBrewId *string
}
