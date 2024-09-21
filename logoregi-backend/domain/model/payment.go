package model

import (
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/oklog/ulid/v2"
)

type Payment struct {
	id            string
	orderIds      []string
	paymentType   PaymentType
	ReceiveAmount uint64
	PaymentAmount uint64
	paymentAt     synchro.Time[tz.UTC]
	updatedAt     synchro.Time[tz.UTC]
}

func NewPayment(orderIds []string, paymentType PaymentType, receiveAmount uint64, paymentAmount uint64) *Payment {
	return &Payment{
		id:            ulid.Make().String(),
		orderIds:      orderIds,
		paymentType:   paymentType,
		ReceiveAmount: receiveAmount,
		PaymentAmount: paymentAmount,
		paymentAt:     synchro.Now[tz.UTC](),
		updatedAt:     synchro.Now[tz.UTC](),
	}
}

func ReconstructPayment(id string, orderIds []string, paymentType PaymentType, receiveAmount uint64, paymentAmount uint64, paymentAt synchro.Time[tz.UTC], updatedAt synchro.Time[tz.UTC]) *Payment {
	return &Payment{
		id:            id,
		orderIds:      orderIds,
		paymentType:   paymentType,
		ReceiveAmount: receiveAmount,
		PaymentAmount: paymentAmount,
		paymentAt:     paymentAt,
		updatedAt:     updatedAt,
	}
}

func (payment *Payment) GetId() string {
	return payment.id
}

func (payment *Payment) GetOrderIds() []string {
	return payment.orderIds
}

func (payment *Payment) GetPaymentType() PaymentType {
	return payment.paymentType
}

func (payment *Payment) GetChangeAmount() uint64 {
	return payment.ReceiveAmount - payment.PaymentAmount
}

func (payment *Payment) GetShortfallAmount() uint64 {
	return payment.PaymentAmount - payment.ReceiveAmount
}

func (payment *Payment) IsEnoughAmount() bool {
	return payment.ReceiveAmount >= payment.PaymentAmount
}

func (payment *Payment) GetPaymentAt() synchro.Time[tz.UTC] {
	return payment.paymentAt
}

func (payment *Payment) GetUpdatedAt() synchro.Time[tz.UTC] {
	return payment.updatedAt
}
