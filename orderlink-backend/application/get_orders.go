package application

import (
	"context"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model/order"
	orderitem "github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model/order_item"
	"github.com/samber/do"
	"github.com/samber/lo"
)

type GetOrdersInput struct {
	Status *uint
}

type GetOrders interface {
	Execute(ctx context.Context, input GetOrdersInput) (*GetOrdersOutput, error)
}

type getOrdersUseCase struct {
	orderQueryServer OrderQueryService
}

func NewGetOrdersUseCase(i *do.Injector) (GetOrders, error) {
	return &getOrdersUseCase{
		orderQueryServer: do.MustInvoke[OrderQueryService](i),
	}, nil
}

func (u *getOrdersUseCase) Execute(ctx context.Context, input GetOrdersInput) (*GetOrdersOutput, error) {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	var orders []*OrderDto
	var err error
	if input.Status != nil {
		orders, err = u.orderQueryServer.FindAllByStatus(ctx, order.OrderStatus(*input.Status))
	} else {
		orders, err = u.orderQueryServer.FindAllNotProvided(ctx)
	}
	if err != nil {
		return nil, err
	}

	outputOrders := lo.Map(orders, func(order *OrderDto, _ int) GetOrdersOutputOrder {
		return GetOrdersOutputOrder{
			OrderId:    order.Id,
			OrderAt:    order.OrderAt,
			OrderType:  uint(order.OrderType),
			TicketAddr: order.TicketAddr,
			Status:     uint(order.Status),
			SeatName:   order.SeatName,
			OrderItems: lo.Map(order.OrderItems, func(item orderitem.OrderItem, _ int) GetOrdersOutputOrderItem {
				return GetOrdersOutputOrderItem{
					Id:           item.Id(),
					ProductId:    item.ProductId(),
					Status:       uint(item.Status()),
					CoffeeBrewId: item.CoffeeBrewId(),
				}
			}),
		}
	})

	output := &GetOrdersOutput{
		Orders: outputOrders,
	}

	return output, nil
}

type GetOrdersOutput struct {
	Orders []GetOrdersOutputOrder
}

type GetOrdersOutputOrder struct {
	OrderId    string
	OrderAt    synchro.Time[tz.UTC]
	OrderType  uint
	TicketAddr string
	Status     uint
	SeatName   *string
	OrderItems []GetOrdersOutputOrderItem
}

type GetOrdersOutputOrderItem struct {
	Id           string
	ProductId    string
	Status       uint
	CoffeeBrewId *string
}
