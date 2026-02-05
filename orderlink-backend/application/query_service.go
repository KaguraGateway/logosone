package application

import (
	"context"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/orderlink-backend/domain/model/order"
	orderitem "github.com/KaguraGateway/logosone/orderlink-backend/domain/model/order_item"
)

type OrderQueryService interface {
	FindAllByStatus(ctx context.Context, status order.OrderStatus) ([]*OrderDto, error)
	FindAllNotProvided(ctx context.Context) ([]*OrderDto, error)
	ListOrdersWithServeAt(ctx context.Context) ([]*OrderWithServeAtDto, error)
}

type OrderDto struct {
	Id         string
	OrderAt    synchro.Time[tz.UTC]
	OrderType  order.OrderType
	TicketAddr string
	Status     order.OrderStatus
	SeatName   *string
	OrderItems []orderitem.OrderItem
}

type OrderWithServeAtDto struct {
	OrderId    string
	OrderAt    synchro.Time[tz.UTC]
	OrderType  order.OrderType
	TicketId   string
	TicketAddr string
	SeatName   string
	Status     order.OrderStatus
	ServedAt   synchro.Time[tz.UTC]
}
