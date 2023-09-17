package dao

type CoffeeBean struct {
	ID           string `bun:",pk"`
	Name         string `bun:",notnull"`
	GramQuantity int    `bun:",notnull"`

	Products []*Product `bun:"rel:has-many,join:id=coffee_bean_id"`
}
