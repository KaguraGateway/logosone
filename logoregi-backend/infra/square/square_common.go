package square

import "time"

type squareAmountMoney struct {
	Amount   int    `json:"amount"`
	Currency string `json:"currency"`
}

type squarePaymentType string

type squareDeviceOptions struct {
	SkipReceiptScreen bool   `json:"skip_receipt_screen"`
	DeviceId          string `json:"device_id"`
}

type squareCheckoutParam struct {
	AmountMoney   squareAmountMoney   `json:"amount_money"`
	PaymentType   squarePaymentType   `json:"payment_type"`
	ReferenceId   string              `json:"reference_id"`
	Note          string              `json:"note"`
	DeviceOptions squareDeviceOptions `json:"device_options"`
}

type squareCheckout struct {
	Id               string              `json:"id"`
	Status           string              `json:"status"`
	CancelReason     string              `json:"cancel_reason"`
	CreatedAt        time.Time           `json:"created_at"`
	UpdatedAt        time.Time           `json:"updated_at"`
	AppId            string              `json:"app_id"`
	DeadlineDuration string              `json:"deadline_duration"`
	AmountMoney      squareAmountMoney   `json:"amount_money"`
	PaymentType      squarePaymentType   `json:"payment_type"`
	ReferenceId      string              `json:"reference_id"`
	Note             string              `json:"note"`
	DeviceOptions    squareDeviceOptions `json:"device_options"`
}
