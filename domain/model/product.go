package model

import (
	"github.com/KaguraGateway/cafelogos-pos-backend/domain"
	"github.com/oklog/ulid/v2"
)

type Product struct {
	productId       string
	ProductName     ProductName
	ProductCategory ProductCategory
	ProductType     ProductType
	IsNowSales      bool
	// Only Coffee
	CoffeeBean  *CoffeeBean
	CoffeeBrews []*ProductCoffeeBrew
	// Only Other
	amount uint64
	Stock  *Stock
}

func NewProductCoffee(productName ProductName, productCategory ProductCategory, isNowSales bool, coffeeBean CoffeeBean, brews []*ProductCoffeeBrew) *Product {
	product := &Product{
		productId:       ulid.Make().String(),
		ProductName:     productName,
		ProductCategory: productCategory,
		ProductType:     ProductType(Coffee),
		IsNowSales:      isNowSales,
		CoffeeBean:      &coffeeBean,
		CoffeeBrews:     brews,
	}
	return product
}

func NewProductOther(productName ProductName, productCategory ProductCategory, isNowSales bool, amount uint64, stock Stock) *Product {
	product := &Product{
		productId:       ulid.Make().String(),
		ProductName:     productName,
		ProductCategory: productCategory,
		ProductType:     ProductType(Other),
		IsNowSales:      isNowSales,
		amount:          amount,
		Stock:           &stock,
	}
	return product
}

func ReconstructProduct(productId string, productName ProductName, productCategory ProductCategory, productType ProductType, isNowSales bool, coffeeBean *CoffeeBean, brews []*ProductCoffeeBrew, amount uint64, stock *Stock) *Product {
	return &Product{
		productId:       productId,
		ProductName:     productName,
		ProductCategory: productCategory,
		ProductType:     productType,
		IsNowSales:      isNowSales,
		CoffeeBean:      coffeeBean,
		CoffeeBrews:     brews,
		amount:          amount,
		Stock:           stock,
	}
}

func (product *Product) GetId() string {
	return product.productId
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
