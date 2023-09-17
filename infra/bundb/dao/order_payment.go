package dao

import (
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
)

type OrderPayment struct {
	ID            string               `bun:",pk"`
	OrderID       string               `bun:",notnull"`
	Order         *Order               `bun:"rel:belongs-to"`
	PaymentType   int                  `bun:",notnull"`
	ReceiveAmount int                  `bun:",notnull"`
	PaymentAmount int                  `bun:",notnull"`
	ChangeAmount  int                  `bun:",notnull"`
	PaymentAt     synchro.Time[tz.UTC] `bun:",notnull"`
}
