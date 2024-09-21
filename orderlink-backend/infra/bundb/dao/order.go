package dao

import (
	"time"
)

type Order struct {
	Id        string    `bun:",pk"`
	OrderType uint      `bun:",notnull"`
	OrderAt   time.Time `bun:",notnull"`
	Status    uint      `bun:",notnull"`
	SeatName  *string

	OrderItems []*OrderItem `bun:"rel:has-many,join:id=order_id"`
	Ticket     *OrderTicket `bun:"rel:has-one,join:id=order_id"`
}
