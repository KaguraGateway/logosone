package dao

import "time"

type OrderItem struct {
	Id               string `bun:",pk"`
	OrderId          string `bun:",notnull"`
	Order            *Order `bun:"rel:belongs-to,join:order_id=id"`
	ProductId        string `bun:",notnull"`
	CoffeeBrewId     *string
	Status           uint    `bun:",notnull"`
	CookingStartTime *time.Time
	CookingEndTime   *time.Time
}
