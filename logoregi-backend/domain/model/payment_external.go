package model

import (
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/domain_event"
	"github.com/oklog/ulid/v2"
)

type PaymentExternal struct {
	id                string
	paymentId         string
	paymentType       string
	status            string // PENDING, IN_PROGRESS, CANCEL_REQUESTED, CANCELED, COMPLETED
	externalServiceId string
	externalDeviceId  string
	createdAt         synchro.Time[tz.UTC]
	updatedAt         synchro.Time[tz.UTC]
	paidAt            *synchro.Time[tz.UTC]
}

func NewPaymentExternal(paymentId string, paymentType string, externalDeviceId string) *PaymentExternal {
	return &PaymentExternal{
		id:                ulid.Make().String(),
		paymentId:         paymentId,
		paymentType:       paymentType,
		status:            "PENDING",
		externalServiceId: "",
		externalDeviceId:  externalDeviceId,
		createdAt:         synchro.Now[tz.UTC](),
		updatedAt:         synchro.Now[tz.UTC](),
		paidAt:            nil,
	}
}

func ReconstructPaymentExternal(id string, paymentId string, paymentType string, status string, externalServiceId string, externalDeviceId string, createdAt synchro.Time[tz.UTC], updatedAt synchro.Time[tz.UTC], paidAt *synchro.Time[tz.UTC]) *PaymentExternal {
	return &PaymentExternal{
		id:                id,
		paymentId:         paymentId,
		paymentType:       paymentType,
		status:            status,
		externalServiceId: externalServiceId,
		externalDeviceId:  externalDeviceId,
		createdAt:         createdAt,
		updatedAt:         updatedAt,
		paidAt:            paidAt,
	}
}

func (payment *PaymentExternal) GetId() string {
	return payment.id
}

func (payment *PaymentExternal) GetPaymentId() string {
	return payment.paymentId
}

func (payment *PaymentExternal) GetPaymentType() string {
	return payment.paymentType
}

func (payment *PaymentExternal) GetStatus() string {
	return payment.status
}

func (payment *PaymentExternal) GetExternalServiceId() string {
	return payment.externalServiceId
}

func (payment *PaymentExternal) GetExternalDeviceId() string {
	return payment.externalDeviceId
}

func (payment *PaymentExternal) GetCreatedAt() synchro.Time[tz.UTC] {
	return payment.createdAt
}

func (payment *PaymentExternal) GetUpdatedAt() synchro.Time[tz.UTC] {
	return payment.updatedAt
}

func (payment *PaymentExternal) GetPaidAt() *synchro.Time[tz.UTC] {
	return payment.paidAt
}

func (payment *PaymentExternal) SetStatus(status string) {
	payment.status = status

	if status == "COMPLETED" {
		now := synchro.Now[tz.UTC]()
		payment.paidAt = &now

		// ドメインイベントの発火
		paymentSuccessEvent := domain_event.NewPaymentSuccessEvent(payment.paymentId)
		domain_event.DomainEventDispatcher.Dispatch(paymentSuccessEvent)
	}
}

func (payment *PaymentExternal) SetExternalServiceId(externalServiceId string) {
	payment.externalServiceId = externalServiceId
}
