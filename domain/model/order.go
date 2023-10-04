package model

import (
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain"
	"github.com/oklog/ulid/v2"
)

type Order struct {
	id         string
	orderItems []OrderItem
	discounts  []Discount
	orderType  OrderType
	payment    *OrderPayment
	orderAt    synchro.Time[tz.UTC]
	clientId   string
	seatId     string
}

func NewOrder(orderItems []OrderItem, discounts []Discount, orderType OrderType, clientId string, seatId string) *Order {
	return &Order{
		id:         ulid.Make().String(),
		orderItems: orderItems,
		discounts:  discounts,
		orderType:  orderType,
		orderAt:    synchro.Now[tz.UTC](),
		clientId:   clientId,
		seatId:     seatId,
	}
}

func ReconstructOrder(id string, orderItems []OrderItem, discounts []Discount, orderType OrderType, payment *OrderPayment, orderAt synchro.Time[tz.UTC], clientId string, seatId string) *Order {
	return &Order{
		id:         id,
		orderItems: orderItems,
		discounts:  discounts,
		orderType:  orderType,
		payment:    payment,
		orderAt:    orderAt,
		clientId:   clientId,
		seatId:     seatId,
	}
}

func (order *Order) GetId() string {
	return order.id
}

func (order *Order) GetOrderItems() []OrderItem {
	return order.orderItems
}

func (order *Order) GetTotalQuantity() uint64 {
	var total uint64
	for _, item := range order.orderItems {
		total += item.GetTotalQuantity()
	}
	return total
}

func (order *Order) GetTotalAmount() uint64 {
	var total uint64
	// 商品価格を合計する
	for _, item := range order.orderItems {
		total += item.GetTotalAmount()
	}
	// 割引を合計する
	for _, discount := range order.discounts {
		if discount.discountType == DiscountType(Price) {
			total -= discount.GetDiscountPrice()
		}
	}
	return total
}

func (order *Order) GetDiscounts() []Discount {
	return order.discounts
}

func (order *Order) GetPayment() *OrderPayment {
	return order.payment
}

func (order *Order) GetOrderAt() synchro.Time[tz.UTC] {
	return order.orderAt
}

func (order *Order) GetClientId() string {
	return order.clientId
}

func (order *Order) GetSeatId() string {
	return order.seatId
}

func (order *Order) GetOrderType() OrderType {
	return order.orderType
}

func (order *Order) Pay(payment OrderPayment) error {
	if payment.PaymentAmount != order.GetTotalAmount() {
		return domain.ErrPaymentAmountInvalid
	} else if !payment.IsEnoughAmount() {
		return domain.ErrPaymentNotEnough
	}
	order.payment = &payment

	return nil
}
