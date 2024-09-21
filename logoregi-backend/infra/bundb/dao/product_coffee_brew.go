package dao

import "time"

type ProductCoffeeBrew struct {
	ID                string    `bun:",pk"`
	Name              string    `bun:",notnull"`
	ProductID         string    `bun:",notnull"`
	BeanQuantityGrams int       `bun:",notnull"`
	Amount            uint      `bun:",notnull"`
	CreatedAt         time.Time `bun:",nullzero,notnull"`
	UpdatedAt         time.Time `bun:",nullzero,notnull,default:current_timestamp"`
}
