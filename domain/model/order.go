package model

import (
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain"
)

type Order struct {
	id         string
	orderItems []OrderItem
	orderAt    synchro.Time[tz.UTC]
	orderType  OrderType
	Status     OrderStatus
	seatName   string
}

func NewOrder(id string, orderItems []OrderItem, orderAt synchro.Time[tz.UTC], orderType OrderType, seatName string) (*Order, error) {
	if len(id) == 0 {
		return nil, domain.ErrInvalidOrderId
	}

	return &Order{
		id:         id,
		orderItems: orderItems,
		orderAt:    orderAt,
		orderType:  orderType,
		Status:     OrderStatus(Prepare),
		seatName:   seatName,
	}, nil
}

func RebuildOrder(id string, orderItems []OrderItem, orderAt synchro.Time[tz.UTC], orderType OrderType, status OrderStatus, seatName string) *Order {
	return &Order{
		id:         id,
		orderItems: orderItems,
		orderAt:    orderAt,
		orderType:  orderType,
		Status:     status,
		seatName:   seatName,
	}
}

func (o *Order) Id() string {
	return o.id
}

func (o *Order) OrderItems() []OrderItem {
	return o.orderItems
}

func (o *Order) OrderAt() synchro.Time[tz.UTC] {
	return o.orderAt
}

func (o *Order) OrderType() OrderType {
	return o.orderType
}

func (o *Order) SeatName() string {
	return o.seatName
}
