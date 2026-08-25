package order

import (
	"fmt"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/orderlink-backend/domain"
	orderitem "github.com/KaguraGateway/logosone/orderlink-backend/domain/model/order_item"
)

type Order struct {
	id                 string
	orderItems         []orderitem.OrderItem
	orderStatusHistory []OrderStatusHistory
	orderAt            synchro.Time[tz.UTC]
	orderType          OrderType
	status             OrderStatus
	seatName           *string
	ticketId           string
	ticketAddr         string
}

func NewOrder(id string, orderItems []orderitem.OrderItem, orderAt synchro.Time[tz.UTC], orderType OrderType, seatName *string, ticketId string, ticketAddr string) (*Order, error) {
	if len(id) == 0 {
		return nil, domain.ErrInvalidOrderId
	}

	return &Order{
		id:         id,
		orderItems: orderItems,
		orderStatusHistory: []OrderStatusHistory{
			NewOrderStatusHistory(NotYet),
		},
		orderAt:   orderAt,
		orderType: orderType,
		status:    OrderStatus(NotYet),
		seatName:  seatName,
		ticketId:  ticketId,
		ticketAddr: ticketAddr,
	}, nil
}

func RebuildOrder(id string, orderItems []orderitem.OrderItem, orderStatusHistories []OrderStatusHistory, orderAt synchro.Time[tz.UTC], orderType OrderType, status OrderStatus, seatName *string, ticketId string, ticketAddr string) *Order {
	return &Order{
		id:                 id,
		orderItems:         orderItems,
		orderStatusHistory: orderStatusHistories,
		orderAt:            orderAt,
		orderType:          orderType,
		status:             status,
		seatName:           seatName,
		ticketId:           ticketId,
		ticketAddr:         ticketAddr,
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

func (o *Order) SeatName() *string {
	return o.seatName
}

func (o *Order) Status() OrderStatus {
	return o.status
}

func (o *Order) OrderStatusHistory() []OrderStatusHistory {
	return o.orderStatusHistory
}
func(o *Order) TicketId() string {
	return o.ticketId
}
func(o *Order) TicketAddr() string{
	return o.ticketAddr
}

func (o *Order) UpdateStatus(status OrderStatus) error {
	fmt.Printf("o.status: %v\n", o.status)
	fmt.Printf("status: %v\n", status)
	fmt.Printf("1: %v\n", status != Provided)
	fmt.Printf("2: %v\n", uint(o.status)+1 != uint(status))
	fmt.Printf("3: %v\n", uint(o.status)-1 != uint(status))
	if status != Provided && uint(o.status)+1 != uint(status) && uint(o.status)-1 != uint(status) {
		return domain.ErrCantOperationOrderStatus
	}
	o.status = status

	o.orderStatusHistory = append(o.orderStatusHistory, NewOrderStatusHistory(status))

	return nil
}
