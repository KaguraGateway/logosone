package grpc_server

import (
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
	"github.com/KaguraGateway/cafelogos-pos-backend/application"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/samber/lo"
)

func ToProtoProductCategory(category *model.ProductCategory) *pos.ProductCategory {
	if category == nil {
		return nil
	}
	return &pos.ProductCategory{
		Id:   category.GetId(),
		Name: category.GetName(),
	}
}

func ToProtoCoffeeBean(bean *model.CoffeeBean) *pos.CoffeeBean {
	if bean == nil {
		return nil
	}
	return &pos.CoffeeBean{
		Id:           bean.GetId(),
		Name:         bean.GetName(),
		GramQuantity: int32(bean.GramQuantity),
	}
}

func ToProtoCoffeeBrew(brew *model.ProductCoffeeBrew) *pos.CoffeeBrew {
	if brew == nil {
		return nil
	}
	return &pos.CoffeeBrew{
		Id:                brew.GetId(),
		Name:              brew.GetName(),
		BeanQuantityGrams: brew.BeanQuantityGrams,
		Amount:            brew.Amount,
	}
}

func ToProtoStock(stock *model.Stock) *pos.Stock {
	if stock == nil {
		return nil
	}
	return &pos.Stock{
		Id:       stock.GetId(),
		Name:     stock.GetName(),
		Quantity: uint32(stock.Quantity),
	}
}

func ToProductParam(product *pos.ProductParam) *application.ProductParam {
	if product == nil {
		return nil
	}
	return &application.ProductParam{
		ProductName:       product.ProductName,
		ProductCategoryId: product.ProductCategoryId,
		ProductType:       uint(product.ProductType),
		IsNowSales:        product.IsNowSales,
		CoffeeBeanId:      product.CoffeeBeanId,
		CoffeeBrews: lo.Map(product.CoffeeBrews, func(brew *pos.CoffeeBrew, _ int) application.CoffeeBrewParam {
			return application.CoffeeBrewParam{
				Id:                brew.Id,
				Name:              brew.Name,
				BeanQuantityGrams: brew.BeanQuantityGrams,
				Amount:            brew.Amount,
			}
		}),
		Amount:  product.Amount,
		StockId: product.StockId,
	}
}
