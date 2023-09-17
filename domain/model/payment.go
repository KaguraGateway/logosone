package model

import "github.com/oklog/ulid/v2"

type Payment struct {
	id            string
	paymentType   PaymentType
	ReceiveAmount uint64
	PaymentAmount uint64
}

func NewPayment(paymentType PaymentType, receiveAmount uint64, paymentAmount uint64) *Payment {
	return &Payment{
		id:            ulid.Make().String(),
		paymentType:   paymentType,
		ReceiveAmount: receiveAmount,
		PaymentAmount: paymentAmount,
	}
}

func ReconstructPayment(id string, paymentType PaymentType, receiveAmount uint64, paymentAmount uint64) *Payment {
	return &Payment{
		id:            id,
		paymentType:   paymentType,
		ReceiveAmount: receiveAmount,
		PaymentAmount: paymentAmount,
	}
}

func (payment *Payment) GetId() string {
	return payment.id
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
