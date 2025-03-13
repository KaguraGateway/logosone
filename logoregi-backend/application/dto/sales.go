package dto

// DailySaleDto 日別売上DTO
type DailySaleDto struct {
	Date          string
	TotalSales    uint64
	TotalQuantity uint64
}

// ProductSaleDto 商品別売上DTO
type ProductSaleDto struct {
	ProductId      string
	ProductName    string
	TotalSales     uint64
	TotalQuantity  uint64
	CoffeeBrewId   string
	CoffeeBrewName string
}

// TimeSlotSaleDto 時間帯別売上DTO
type TimeSlotSaleDto struct {
	StartDate     string
	EndDate       string
	TotalSales    uint64
	TotalQuantity uint64
}

// PaymentTypeSaleDto 支払い方法別売上DTO
type PaymentTypeSaleDto struct {
	PaymentType   int
	TotalSales    uint64
	TotalQuantity uint64
}
