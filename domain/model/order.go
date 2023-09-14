package model

import (
	"time"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain"
	"github.com/google/uuid"
)

type Order struct {
	id         uuid.UUID
	orderItems []OrderItem
	discounts  []Discount
	payment    Payment
	orderAt    time.Time
}

func NewOrder(orderItems []OrderItem, discounts []Discount) *Order {
	return &Order{
		id:         uuid.UUID{},
		orderItems: orderItems,
		discounts:  discounts,
		orderAt:    time.Now(),
	}
}

func ReconstructOrder(id uuid.UUID, orderItems []OrderItem, discounts []Discount, payment Payment, paymentAt time.Time, orderAt time.Time) *Order {
	return &Order{
		id:         id,
		orderItems: orderItems,
		discounts:  discounts,
		payment:    payment,
		orderAt:    orderAt,
	}
}

func (order *Order) GetOrderItems() []OrderItem {
	return order.orderItems
}

func (order *Order) GetTotalQuantity() uint64 {
	var total uint64
	for _, item := range order.orderItems {
		total += item.GetTotalQunatity()
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

func (order *Order) GetPayment() Payment {
	return order.payment
}

func (order *Order) GetOrderAt() time.Time {
	return order.orderAt
}

func (order *Order) pay(payment Payment) error {
	if !payment.IsEnoughAmount() {
		return domain.ErrPaymentNotEnought
	}
	order.payment = payment

	return nil
}
