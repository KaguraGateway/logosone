package product

import "github.com/google/uuid"

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
	Stock *Stock
}

func NewProductCoffee(productName ProductName, productCategory ProductCategory, coffeeBean CoffeeBean, brews CoffeeHowToBrews) (error, *Product) {
	product := &Product{
		productId:        uuid.UUID{},
		ProductName:      productName,
		ProductCategory:  productCategory,
		ProductType:      ProductType(Coffee),
		IsNowSales:       true,
		CoffeeBean:       &coffeeBean,
		CoffeeHowToBrews: &brews,
	}
	return nil, product
}

func NewProductOther(productName ProductName, productCategory ProductCategory, stock Stock) (error, *Product) {
	product := &Product{
		productId:       uuid.UUID{},
		ProductName:     productName,
		ProductCategory: productCategory,
		ProductType:     ProductType(Other),
		IsNowSales:      true,
		Stock:           &stock,
	}
	return nil, product
}

func ReconstructProduct(productId uuid.UUID, productName ProductName, productCategory ProductCategory, productType ProductType, isNowSales bool, coffeeBean *CoffeeBean, brews *CoffeeHowToBrews, stock *Stock) *Product {
	return &Product{
		productId:        productId,
		ProductName:      productName,
		ProductCategory:  productCategory,
		ProductType:      productType,
		IsNowSales:       isNowSales,
		CoffeeBean:       coffeeBean,
		CoffeeHowToBrews: brews,
		Stock:            stock,
	}
}

func (product *Product) GetId() uuid.UUID {
	return product.productId
}
