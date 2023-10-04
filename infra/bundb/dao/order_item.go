package dao

type OrderItem struct {
	OrderID      string   `bun:",pk"`
	Order        *Order   `bun:"rel:belongs-to,join:order_id=id"`
	ProductID    string   `bun:",pk"`
	Product      *Product `bun:"rel:belongs-to,join:product_id=id"`
	quantity     uint64   `bun:",notnull"`
	amount       uint64   `bun:",notnull"`
	CoffeeBrewID string
	CoffeeBrew   *ProductCoffeeBrew `bun:"rel:belongs-to,join:coffee_brew_id=id"`
}
