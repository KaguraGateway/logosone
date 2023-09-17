package dao

type ProductCoffeeBrew struct {
	ID                string   `bun:",pk"`
	Name              string   `bun:",notnull"`
	ProductID         string   `bun:",notnull"`
	BeanQuantityGrams int      `bun:",notnull"`
	Amount            uint     `bun:",notnull"`
}
