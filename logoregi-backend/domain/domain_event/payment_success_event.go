package domain_event

const PaymentSuccessEventName = "PaymentSuccessEvent"

type PaymentSuccessEvent struct {
	paymentId string
}

func NewPaymentSuccessEvent(paymentId string) DomainEvent {
	return &PaymentSuccessEvent{
		paymentId: paymentId,
	}
}

func (p PaymentSuccessEvent) EventName() string {
	return PaymentSuccessEventName
}

func (p PaymentSuccessEvent) PaymentId() string {
	return p.paymentId
}
