package application

type CoffeeBrewParam struct {
	Id                string
	Name              string
	BeanQuantityGrams uint32
	Amount            uint64
}

type ProductParam struct {
	ProductName       string
	ProductCategoryId string
	ProductType       uint
	IsNowSales        bool
	CoffeeBeanId      string
	CoffeeBrews       []CoffeeBrewParam
	Amount            uint64
	StockId           string
}
