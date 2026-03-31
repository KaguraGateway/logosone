package orderlink_server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/orderlink"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/orderlink/orderlinkconnect"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/samber/do"
	"github.com/samber/lo"
)

type orderHookOrderLink struct {
	client          orderlinkconnect.OrderLinkServiceClient
	seatRepository  repository.SeatRepository
	orderRepository repository.OrderRepository
}

func NewOrderHookOrderLink(i *do.Injector) (repository.OrderHookRepository, error) {
	return &orderHookOrderLink{
		client:          do.MustInvoke[orderlinkconnect.OrderLinkServiceClient](i),
		seatRepository:  do.MustInvoke[repository.SeatRepository](i),
		orderRepository: do.MustInvoke[repository.OrderRepository](i),
	}, nil
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

	// 調理中のオーダーを取得
	processingOrders, err := i.orderRepository.FindAllByStatus(ctx, model.OrderStatusProcessing)
	if err != nil {
		return err
	}
	// 調理中のオーダーの残り時間を計算
	var totalBrewingTime uint32
	for _, processingOrder := range processingOrders {
		for _, item := range processingOrder.GetOrderItems() {
			if item.GetCoffeeHowToBrew() != nil {
				totalBrewingTime += item.GetCoffeeHowToBrew().GetBrewingTime()
			}
		}
	}

	var estimatedCookingTime uint32
	if order.GetStatus() == model.OrderStatusUnprocessed {
		estimatedCookingTime = totalBrewingTime
		for _, item := range order.GetOrderItems() {
			if item.GetCoffeeHowToBrew() != nil {
				estimatedCookingTime += item.GetCoffeeHowToBrew().GetBrewingTime()
			}
		}
	} else if order.GetStatus() == model.OrderStatusProcessing {
		for _, item := range order.GetOrderItems() {
			if item.GetCoffeeHowToBrew() != nil {
				estimatedCookingTime += item.GetCoffeeHowToBrew().GetBrewingTime()
			}
		}
	}

	_, err = i.client.PostOrder(ctx, connect.NewRequest(&orderlink.PostOrderInput{
		OrderId: order.GetId(),
		OrderAt: order.GetOrderAt().Format("2006-01-02T15:04:05Z"),
		Items: lo.Map(order.GetOrderItems(), func(item model.OrderItem, _ int) *orderlink.PostOrderItemInput {
			coffeeBrew := item.GetCoffeeHowToBrew()
			var coffeeBrewId = ""
			if coffeeBrew != nil {
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
		Type:                 orderlink.PostOrderInput_OrderType(order.GetOrderType()),
		TicketId:             ticket.GetTicketId(),
		TicketAddr:           ticket.GetTicketAddr(),
		SeatName:             seatName,
		EstimatedCookingTime: estimatedCookingTime,
	}))
	if err != nil {
		return err
	}
	return nil
}
