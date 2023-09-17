package grpc_server

import (
	"github.com/KaguraGateway/cafelogos-grpc/pkg/proto"
	"github.com/KaguraGateway/cafelogos-pos-backend/application"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/samber/lo"
)

func ToProtoProductCategory(category *model.ProductCategory) *proto.ProductCategory {
	return &proto.ProductCategory{
		Id:   category.GetId(),
		Name: category.GetName(),
	}
}

func ToProtoCoffeeBean(bean *model.CoffeeBean) *proto.CoffeeBean {
	return &proto.CoffeeBean{
		Id:           bean.GetId(),
		Name:         bean.GetName(),
		GramQuantity: int32(bean.GramQuantity),
	}
}

func ToProtoCoffeeBrew(brew *model.ProductCoffeeBrew) *proto.CoffeeBrew {
	return &proto.CoffeeBrew{
		Id:                brew.GetId(),
		Name:              brew.GetName(),
		BeanQuantityGrams: brew.BeanQuantityGrams,
		Amount:            brew.Amount,
	}
}

func ToProtoStock(stock *model.Stock) *proto.Stock {
	return &proto.Stock{
		Id:       stock.GetId(),
		Name:     stock.GetName(),
		Quantity: uint32(stock.Quantity),
	}
}

func ToProductParam(product *proto.ProductParam) *application.ProductParam {
	return &application.ProductParam{
		ProductName:       product.ProductName,
		ProductCategoryId: product.ProductCategoryId,
		ProductType:       uint(product.ProductType),
		IsNowSales:        product.IsNowSales,
		CoffeeBeanId:      product.CoffeeBeanId,
		CoffeeBrews: lo.Map(product.CoffeeBrews, func(brew *proto.CoffeeBrew, _ int) application.CoffeeBrewParam {
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
