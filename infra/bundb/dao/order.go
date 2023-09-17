package dao

import (
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
)

type Order struct {
	ID       string               `bun:",pk"`
	OrderAt  synchro.Time[tz.UTC] `bun:",notnull"`
	ClientID string               `bun:",notnull"`
	Client   *Client              `bun:"rel:belongs-to"`

	OrderItems     []*OrderItem     `bun:"rel:has-many,join:id=order_id"`
	OrderPayment   *OrderPayment    `bun:"rel:has-one"`
	OrderDiscounts []*OrderDiscount `bun:"rel:has-many"`
}
