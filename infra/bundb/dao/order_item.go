package dao

type OrderItem struct {
	OrderID      string   `bun:",pk"`
	Order        *Order   `bun:"rel:belongs-to"`
	ProductID    string   `bun:",pk"`
	Product      *Product `bun:"rel:belongs-to"`
	quantity     int      `bun:",notnull"`
	amount       int      `bun:",notnull"`
	CoffeeBrewID string
	CoffeeBrew   *ProductCoffeeBrew `bun:"rel:belongs-to"`
}
