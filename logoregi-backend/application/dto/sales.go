package dto

import (
	"time"
)

// 日別売上DTO
type DailySaleDto struct {
	Date          string
	TotalSales    uint64
	TotalQuantity uint64
}

// 商品別売上DTO
type ProductSaleDto struct {
	ProductId      string
	ProductName    string
	TotalSales     uint64
	TotalQuantity  uint64
	CoffeeBrewId   string
	CoffeeBrewName string
}

// 時間帯別売上DTO
type TimeSlotSaleDto struct {
	TimeSlot      string
	TotalSales    uint64
	TotalQuantity uint64
}

// 支払い方法別売上DTO
type PaymentTypeSaleDto struct {
	PaymentType   int
	TotalSales    uint64
	TotalQuantity uint64
}
