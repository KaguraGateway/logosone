package application

import (
	"context"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model/order"
	orderitem "github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model/order_item"
)

type OrderQueryService interface {
	FindAllByStatus(ctx context.Context, status order.OrderStatus) ([]*OrderDto, error)
	FindAllNotProvided(ctx context.Context) ([]*OrderDto, error)
}

type OrderDto struct {
	Id    string
	OrderAt    synchro.Time[tz.UTC]
	OrderType  order.OrderType
	TicketAddr string
	Status     order.OrderStatus
	SeatName   *string
	OrderItems []orderitem.OrderItem
}
