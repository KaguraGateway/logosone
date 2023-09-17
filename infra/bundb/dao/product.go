package dao

type Product struct {
	ID           string           `bun:",pk"`
	Name         string           `bun:",notnull"`
	CategoryID   string           `bun:",notnull"`
	Category     *ProductCategory `bun:"rel:has-one,join:category_id=id"`
	ProductType  uint             `bun:",notnull"`
	IsNowSales   bool             `bun:",notnull"`
	CoffeeBeanID string
	CoffeeBean   *CoffeeBean `bun:"rel:has-one,join:coffee_bean_id=id"`
	Amount       uint
	StockId      string
	Stock        *Stock `bun:"rel:has-one,join:stock_id=id"`

	CoffeeBrews []*ProductCoffeeBrew `bun:"rel:has-many,join:id=product_id"`
}
