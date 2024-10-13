package model

import (
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain"
	"github.com/oklog/ulid/v2"
)

type Product struct {
	productId       string
	ProductName     ProductName
	ProductCategory ProductCategory
	ProductType     ProductType
	Color           string
	IsNowSales      bool
	createdAt       synchro.Time[tz.UTC]
	updatedAt       synchro.Time[tz.UTC]
	// Only Coffee
	CoffeeBean  *CoffeeBean
	CoffeeBrews []*ProductCoffeeBrew
	// Only Other
	amount uint64
	Stock  *Stock
}

func NewProductCoffee(productName ProductName, productCategory ProductCategory, color string, isNowSales bool, coffeeBean CoffeeBean, brews []*ProductCoffeeBrew) *Product {
	product := &Product{
		productId:       ulid.Make().String(),
		ProductName:     productName,
		ProductCategory: productCategory,
		ProductType:     ProductType(Coffee),
		Color:           color,
		IsNowSales:      isNowSales,
		createdAt:       synchro.Now[tz.UTC](),
		updatedAt:       synchro.Now[tz.UTC](),
		CoffeeBean:      &coffeeBean,
		CoffeeBrews:     brews,
	}
	return product
}

func NewProductOther(productName ProductName, productCategory ProductCategory, color string, isNowSales bool, amount uint64, stock Stock) *Product {
	product := &Product{
		productId:       ulid.Make().String(),
		ProductName:     productName,
		ProductCategory: productCategory,
		ProductType:     ProductType(Other),
		IsNowSales:      isNowSales,
		createdAt:       synchro.Now[tz.UTC](),
		updatedAt:       synchro.Now[tz.UTC](),
		amount:          amount,
		Stock:           &stock,
	}
	return product
}

func ReconstructProduct(productId string, productName ProductName, productCategory ProductCategory, productType ProductType, color string, isNowSales bool, createdAt synchro.Time[tz.UTC], updatedAt synchro.Time[tz.UTC], coffeeBean *CoffeeBean, brews []*ProductCoffeeBrew, amount uint64, stock *Stock) *Product {
	return &Product{
		productId:       productId,
		ProductName:     productName,
		ProductCategory: productCategory,
		ProductType:     productType,
		Color:           color,
		IsNowSales:      isNowSales,
		createdAt:       createdAt,
		updatedAt:       updatedAt,
		CoffeeBean:      coffeeBean,
		CoffeeBrews:     brews,
		amount:          amount,
		Stock:           stock,
	}
}

func (product *Product) GetId() string {
	return product.productId
}

func (product *Product) GetCreatedAt() synchro.Time[tz.UTC] {
	return product.createdAt
}

func (product *Product) GetUpdatedAt() synchro.Time[tz.UTC] {
	return product.updatedAt
}

func (product *Product) GetAmount() (uint64, error) {
	if product.ProductType == ProductType(Coffee) {
		return 0, domain.ErrProductUnsettledAmount
	}
	return product.amount, nil
}

func (product *Product) SetAmount(amount uint64) error {
	if product.ProductType != ProductType(Other) {
		return domain.ErrProductUnsettledAmount
	}
	product.amount = amount
	return nil
}
