package dao

import "time"

type CoffeeBean struct {
	ID           string    `bun:",pk"`
	Name         string    `bun:",notnull"`
	GramQuantity int       `bun:",notnull"`
	CreatedAt    time.Time `bun:",nullzero,notnull"`
	UpdatedAt    time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	Products []*Product `bun:"rel:has-many,join:id=coffee_bean_id"`
}
