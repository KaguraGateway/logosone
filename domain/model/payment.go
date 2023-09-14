package model

import "github.com/google/uuid"

type Payment struct {
	id            uuid.UUID
	paymentType   PaymentType
	ReceiveAmount uint64
	PaymentAmount uint64
}

func NewPayment(paymentType PaymentType, receiveAmount uint64, paymentAmount uint64) *Payment {
	return &Payment{
		id:            uuid.UUID{},
		paymentType:   paymentType,
		ReceiveAmount: receiveAmount,
		PaymentAmount: paymentAmount,
	}
}

func ReconstructPayment(id uuid.UUID, paymentType PaymentType, receiveAmount uint64, paymentAmount uint64) *Payment {
	return &Payment{
		id:            id,
		paymentType:   paymentType,
		ReceiveAmount: receiveAmount,
		PaymentAmount: paymentAmount,
	}
}

func (payment *Payment) GetId() uuid.UUID {
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
