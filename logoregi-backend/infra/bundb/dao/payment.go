package dao

import (
	"time"
)

type Payment struct {
	ID            string          `bun:",pk"`
	PaymentType   uint            `bun:",notnull"`
	ReceiveAmount uint64          `bun:",notnull"`
	PaymentAmount uint64          `bun:",notnull"`
	ChangeAmount  uint64          `bun:",notnull"`
	PaymentAt     time.Time       `bun:",notnull"`
	UpdatedAt     time.Time       `bun:",nullzero,notnull,default:current_timestamp"`
	OrderPayments []*OrderPayment `bun:"rel:has-many"`
}
