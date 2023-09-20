package order

import (
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain"
	orderitem "github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model/order_item"
)

type Order struct {
	id         string
	orderItems []orderitem.OrderItem
	orderAt    synchro.Time[tz.UTC]
	orderType  OrderType
	status     OrderStatus
	seatName   string
}

func NewOrder(id string, orderItems []orderitem.OrderItem, orderAt synchro.Time[tz.UTC], orderType OrderType, seatName string) (*Order, error) {
	if len(id) == 0 {
		return nil, domain.ErrInvalidOrderId
	}

	return &Order{
		id:         id,
		orderItems: orderItems,
		orderAt:    orderAt,
		orderType:  orderType,
		status:     OrderStatus(NotYet),
		seatName:   seatName,
	}, nil
}

func RebuildOrder(id string, orderItems []orderitem.OrderItem, orderAt synchro.Time[tz.UTC], orderType OrderType, status OrderStatus, seatName string) *Order {
	return &Order{
		id:         id,
		orderItems: orderItems,
		orderAt:    orderAt,
		orderType:  orderType,
		status:     status,
		seatName:   seatName,
	}
}

func (o *Order) Id() string {
	return o.id
}

func (o *Order) OrderItems() []orderitem.OrderItem {
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

func (o *Order) Status() OrderStatus {
	return o.status
}

func (o *Order) UpdateStatus(status OrderStatus) error {
	if status != Provided && (uint(o.status)+1 != uint(status) || uint(o.status)-1 != uint(status)) {
		return domain.ErrCantOperationOrderStatus
	}
	o.status = status
	return nil
}
