package orderlink_server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/logosone/proto/pkg/orderlink"
	"github.com/KaguraGateway/logosone/proto/pkg/orderlink/orderlinkconnect"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/samber/do"
	"github.com/samber/lo"
)

type orderHookOrderLink struct {
	client         orderlinkconnect.OrderLinkServiceClient
	seatRepository repository.SeatRepository
}

func NewOrderHookOrderLink(i *do.Injector) (repository.OrderHookRepository, error) {
	return &orderHookOrderLink{client: do.MustInvoke[orderlinkconnect.OrderLinkServiceClient](i), seatRepository: do.MustInvoke[repository.SeatRepository](i)}, nil
}

func (i *orderHookOrderLink) PostOrder(ctx context.Context, order *model.Order, ticket *model.OrderTicket) error {
	var seatName string
	if len(order.GetSeatId()) > 0 {
		if seat, err := i.seatRepository.FindById(ctx, order.GetSeatId()); err != nil {
			return err
		} else {
			seatName = seat.GetName()
		}
	}

	_, err := i.client.PostOrder(ctx, connect.NewRequest(&orderlink.PostOrderInput{
		OrderId: order.GetId(),
		OrderAt: order.GetOrderAt().Format("2006-01-02T15:04:05Z"),
		Items: lo.Map(order.GetOrderItems(), func(item model.OrderItem, _ int) *orderlink.PostOrderItemInput {
			coffeeBrew := item.GetCoffeeHowToBrew()
			var coffeeBrewId = ""
			if &coffeeBrew != nil {
				coffeeBrewId = coffeeBrew.GetId()
			}
			return &orderlink.PostOrderItemInput{
				ProductId:       item.GetProductId(),
				CoffeeBrewId:    coffeeBrewId,
				Quantity:        uint32(item.Quantity),
				IsManagingOrder: item.IsManagingOrder(),
				IsOlKitchen:     item.IsOlUseKitchen(),
			}
		}),
		Type:       orderlink.PostOrderInput_OrderType(order.GetOrderType()),
		TicketId:   ticket.GetTicketId(),
		TicketAddr: ticket.GetTicketAddr(),
		SeatName:   seatName,
	}))
	if err != nil {
		return err
	}
	return nil
}
