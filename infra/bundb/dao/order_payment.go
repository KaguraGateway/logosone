package dao

import (
	"time"
)

type OrderPayment struct {
	ID            string    `bun:",pk"`
	OrderID       string    `bun:",notnull"`
	Order         *Order    `bun:"rel:belongs-to,join:order_id=id"`
	PaymentType   uint      `bun:",notnull"`
	ReceiveAmount uint64    `bun:",notnull"`
	PaymentAmount uint64    `bun:",notnull"`
	ChangeAmount  uint64    `bun:",notnull"`
	PaymentAt     time.Time `bun:",notnull"`
	UpdatedAt     time.Time `bun:",nullzero,notnull,default:current_timestamp"`
}
