package dao

import (
	"time"
)

type OrderPayment struct {
	ID            string    `bun:",pk"`
	OrderID       string    `bun:",notnull"`
	Order         *Order    `bun:"rel:belongs-to,join:order_id=id"`
	PaymentType   int       `bun:",notnull"`
	ReceiveAmount int       `bun:",notnull"`
	PaymentAmount int       `bun:",notnull"`
	ChangeAmount  int       `bun:",notnull"`
	PaymentAt     time.Time `bun:",notnull"`
	UpdatedAt    time.Time `bun:",nullzero,notnull,default:current_timestamp"`
}
