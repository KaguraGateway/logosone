package dao

type CoffeeBean struct {
	ID           string `bun:",pk"`
	Name         string `bun:",notnull"`
	GramQuantity int    `bun:",notnull"`
}
