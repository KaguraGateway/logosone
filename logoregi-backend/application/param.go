package application

import (
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
)

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
	Color             string
	IsNowSales        bool
	CoffeeBeanId      string
	CoffeeBrews       []CoffeeBrewParam
	Amount            uint64
	StockId           string
	IsManagingOrder   bool
	IsOlUseKitchen    bool
}

type PaymentParam struct {
	Id            string
	PaymentType   model.PaymentType
	PostOrders    []PostOrderParam
	OrderIds      []string
	ReceiveAmount uint64
	PaymentAmount uint64
	ChangeAmount  uint64
	PaymentAt     synchro.Time[tz.UTC]
	UpdatedAt     synchro.Time[tz.UTC]
}
