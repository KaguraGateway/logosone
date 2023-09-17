package dao

type ProductCoffeeBrew struct {
	ID                string   `bun:",pk"`
	Name              string   `bun:",notnull"`
	ProductID         string   `bun:",notnull"`
	Product           *Product `bun:"rel:belongs-to"`
	BeanQuantityGrams int      `bun:",notnull"`
	Amount            uint     `bun:",notnull"`
}
