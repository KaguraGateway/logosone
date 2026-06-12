package dao

import "time"

type OrderStatusHistory struct {
	Id        string    `bun:",pk"`
	OrderId   string    `bun:",notnull"`
	Order     *Order    `bun:"rel:belongs-to,join:order_id=id"`
	Status    uint      `bun:",notnull"`
	CreatedAt time.Time `bun:",notnull"`
}
