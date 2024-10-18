package dao

import "time"

type Product struct {
	ID           string           `bun:",pk"`
	Name         string           `bun:",notnull"`
	CategoryID   string           `bun:",notnull"`
	Category     *ProductCategory `bun:"rel:has-one,join:category_id=id"`
	ProductType  uint             `bun:",notnull"`
	Color        string           `bun:",notnull"`
	IsNowSales   bool             `bun:",notnull"`
	CoffeeBeanID string
	CoffeeBean   *CoffeeBean `bun:"rel:has-one,join:coffee_bean_id=id"`
	Amount       uint64
	StockId      string
	Stock        *Stock    `bun:"rel:has-one,join:stock_id=id"`
	CreatedAt    time.Time `bun:",nullzero,notnull"`
	UpdatedAt    time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	IsManagingOrder bool `bun:",notnull"`
	IsOlUseKitchen  bool `bun:",notnull"`

	CoffeeBrews []*ProductCoffeeBrew `bun:"rel:has-many,join:id=product_id"`
}
