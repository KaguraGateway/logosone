package order

import (
	"time"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/payment"
	"github.com/google/uuid"
)

type Order struct {
	id         uuid.UUID
	orderItems []OrderItem
	discounts  []Discount
	payment    payment.Payment
	paymentAt  time.Time
	orderAt    time.Time
	callNumber CallNumber
}

func NewOrder(orderItems []OrderItem, discounts []Discount) *Order {
	return &Order{
		id:         uuid.UUID{},
		orderItems: orderItems,
		discounts:  discounts,
		orderAt:    time.Now(),
	}
}

func ReconstructOrder(id uuid.UUID, orderItems []OrderItem, discounts []Discount, payment payment.Payment, paymentAt time.Time, orderAt time.Time, callNumber CallNumber) *Order {
	return &Order{
		id:         id,
		orderItems: orderItems,
		discounts:  discounts,
		payment:    payment,
		paymentAt:  paymentAt,
		orderAt:    orderAt,
		callNumber: callNumber,
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

func (order *Order) GetPayment() payment.Payment {
	return order.payment
}

func (order *Order) GetPaymentAt() time.Time {
	return order.paymentAt
}

func (order *Order) GetOrderAt() time.Time {
	return order.orderAt
}

func (order *Order) GetCallNumber() CallNumber {
	return order.callNumber
}

func (order *Order) pay(payment payment.Payment, paymentAt time.Time) error {
	if !payment.IsEnoughAmount() {
		return domain.ErrPaymentNotEnought
	}
	order.paymentAt = paymentAt
	order.payment = payment

	return nil
}
