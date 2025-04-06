package model

import (
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/oklog/ulid/v2"
)

type Payment struct {
	id              string
	orderIds        []string
	paymentType     PaymentType
	ReceiveAmount   int64
	PaymentAmount   int64
	originalPaymentId string
	paymentAt       synchro.Time[tz.UTC]
	updatedAt       synchro.Time[tz.UTC]
}

func NewPayment(orderIds []string, paymentType PaymentType, receiveAmount int64, paymentAmount int64) *Payment {
	return &Payment{
		id:              ulid.Make().String(),
		orderIds:        orderIds,
		paymentType:     paymentType,
		ReceiveAmount:   receiveAmount,
		PaymentAmount:   paymentAmount,
		originalPaymentId: "",
		paymentAt:       synchro.Now[tz.UTC](),
		updatedAt:       synchro.Now[tz.UTC](),
	}
}

func ReconstructPayment(id string, orderIds []string, paymentType PaymentType, receiveAmount int64, paymentAmount int64, originalPaymentId string, paymentAt synchro.Time[tz.UTC], updatedAt synchro.Time[tz.UTC]) *Payment {
	return &Payment{
		id:              id,
		orderIds:        orderIds,
		paymentType:     paymentType,
		ReceiveAmount:   receiveAmount,
		PaymentAmount:   paymentAmount,
		originalPaymentId: originalPaymentId,
		paymentAt:       paymentAt,
		updatedAt:       updatedAt,
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

func (payment *Payment) GetChangeAmount() int64 {
	if payment.ReceiveAmount >= payment.PaymentAmount {
		return payment.ReceiveAmount - payment.PaymentAmount
	}
	return 0
}

func (payment *Payment) GetShortfallAmount() int64 {
	if payment.PaymentAmount > payment.ReceiveAmount {
		return payment.PaymentAmount - payment.ReceiveAmount
	}
	return 0
}

func (payment *Payment) IsEnoughAmount() bool {
	return payment.ReceiveAmount >= payment.PaymentAmount
}

func (payment *Payment) GetPaymentStatus() PaymentStatus {
	if payment.IsEnoughAmount() {
		return PaymentStatusSuccess
	}
	return PaymentStatusPending
}

func (payment *Payment) GetPaymentAt() synchro.Time[tz.UTC] {
	return payment.paymentAt
}

func (payment *Payment) GetUpdatedAt() synchro.Time[tz.UTC] {
	return payment.updatedAt
}

func (payment *Payment) GetOriginalPaymentId() string {
	return payment.originalPaymentId
}

func (payment *Payment) IsRefund() bool {
	return payment.paymentType == Refund
}

func (payment *Payment) SetOriginalPaymentId(id string) error {
	payment.originalPaymentId = id
	return nil
}
