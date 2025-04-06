package dao

import (
	"time"
)

type Payment struct {
	ID               string           `bun:",pk"`
	PaymentType      uint             `bun:",notnull"`
	ReceiveAmount    int64            `bun:",notnull"`
	PaymentAmount    int64            `bun:",notnull"`
	ChangeAmount     int64            `bun:",notnull"`
	OriginalPaymentId string           `bun:",nullzero"`
	PaymentAt        time.Time        `bun:",notnull"`
	UpdatedAt        time.Time        `bun:",nullzero,notnull,default:current_timestamp"`
	OrderPayments    []*OrderPayment  `bun:"rel:has-many"`
	PaymentExternal  *PaymentExternal `bun:"rel:has-one"`
}
