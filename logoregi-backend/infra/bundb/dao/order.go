package dao

import (
	"time"
)

type Order struct {
	ID        string    `bun:",pk"`
	OrderType uint      `bun:",notnull"`
	OrderAt   time.Time `bun:",notnull"`
	ClientID  string    `bun:",notnull"`
	Client    *Client   `bun:"rel:belongs-to"`

	SeatID string
	Seat   *Seat `bun:"rel:belongs-to,join:seat_id=id"`

	OrderItems     []*OrderItem     `bun:"rel:has-many,join:id=order_id"`
	OrderDiscounts []*OrderDiscount `bun:"rel:has-many"`
	OrderTicket    *OrderTicket     `bun:"rel:has-one,join:id=order_id"`
	OrderPayment   *OrderPayment    `bun:"rel:has-one,join:id=order_id"`
}
