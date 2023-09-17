package dao

type Product struct {
	ID           string           `bun:",pk"`
	Name         string           `bun:",notnull"`
	CategoryID   string           `bun:",notnull"`
	Category     *ProductCategory `bun:"rel:has-one"`
	ProductType  uint             `bun:",notnull"`
	IsNowSales   bool             `bun:",notnull,default:true"`
	CoffeeBeanID string
	CoffeeBean   *CoffeeBean `bun:"rel:has-one"`
	Amount       uint
	StockId      string
	Stock        *Stock `bun:"rel:has-one"`
}
