package product

import (
	"github.com/KaguraGateway/cafelogos-pos-backend/domain"
	"github.com/google/uuid"
)

type Product struct {
	productId       uuid.UUID
	ProductName     ProductName
	ProductCategory ProductCategory
	ProductType     ProductType
	IsNowSales      bool
	// Only Coffee
	CoffeeBean       *CoffeeBean
	CoffeeHowToBrews *CoffeeHowToBrews
	// Only Other
	amount uint64
	Stock  *Stock
}

func NewProductCoffee(productName ProductName, productCategory ProductCategory, coffeeBean CoffeeBean, brews CoffeeHowToBrews) *Product {
	product := &Product{
		productId:        uuid.UUID{},
		ProductName:      productName,
		ProductCategory:  productCategory,
		ProductType:      ProductType(Coffee),
		IsNowSales:       true,
		CoffeeBean:       &coffeeBean,
		CoffeeHowToBrews: &brews,
	}
	return product
}

func NewProductOther(productName ProductName, productCategory ProductCategory, amount uint64, stock Stock) *Product {
	product := &Product{
		productId:       uuid.UUID{},
		ProductName:     productName,
		ProductCategory: productCategory,
		ProductType:     ProductType(Other),
		IsNowSales:      true,
		amount:          amount,
		Stock:           &stock,
	}
	return product
}

func ReconstructProduct(productId uuid.UUID, productName ProductName, productCategory ProductCategory, productType ProductType, isNowSales bool, coffeeBean *CoffeeBean, brews *CoffeeHowToBrews, amount uint64, stock *Stock) *Product {
	return &Product{
		productId:        productId,
		ProductName:      productName,
		ProductCategory:  productCategory,
		ProductType:      productType,
		IsNowSales:       isNowSales,
		CoffeeBean:       coffeeBean,
		CoffeeHowToBrews: brews,
		amount:           amount,
		Stock:            stock,
	}
}

func (product *Product) GetId() uuid.UUID {
	return product.productId
}

func (product *Product) GetAmount() (uint64, error) {
	if product.ProductType == ProductType(Coffee) {
		return 0, domain.ErrProductUnsettledAmount
	}
	return product.amount, nil
}
