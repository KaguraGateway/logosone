package model

import (
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/oklog/ulid/v2"
)

type OrderPayment struct {
	id            string
	orderId       string
	paymentType   PaymentType
	ReceiveAmount uint64
	PaymentAmount uint64
	paymentAt     synchro.Time[tz.UTC]
	updatedAt     synchro.Time[tz.UTC]
}

func NewOrderPayment(orderId string, paymentType PaymentType, receiveAmount uint64, paymentAmount uint64) *OrderPayment {
	return &OrderPayment{
		id:            ulid.Make().String(),
		orderId:       orderId,
		paymentType:   paymentType,
		ReceiveAmount: receiveAmount,
		PaymentAmount: paymentAmount,
		paymentAt:     synchro.Now[tz.UTC](),
		updatedAt:     synchro.Now[tz.UTC](),
	}
}

func ReconstructOrderPayment(id string, orderId string, paymentType PaymentType, receiveAmount uint64, paymentAmount uint64, paymentAt synchro.Time[tz.UTC], updatedAt synchro.Time[tz.UTC]) *OrderPayment {
	return &OrderPayment{
		id:            id,
		orderId:       orderId,
		paymentType:   paymentType,
		ReceiveAmount: receiveAmount,
		PaymentAmount: paymentAmount,
		paymentAt:     paymentAt,
		updatedAt:     updatedAt,
	}
}

func (payment *OrderPayment) GetId() string {
	return payment.id
}

func (payment *OrderPayment) GetPaymentType() PaymentType {
	return payment.paymentType
}

func (payment *OrderPayment) GetChangeAmount() uint64 {
	return payment.ReceiveAmount - payment.PaymentAmount
}

func (payment *OrderPayment) GetShortfallAmount() uint64 {
	return payment.PaymentAmount - payment.ReceiveAmount
}

func (payment *OrderPayment) IsEnoughAmount() bool {
	return payment.ReceiveAmount >= payment.PaymentAmount
}
