package grpc_server

import (
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
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

func ToProtoOrderItem(item *model.OrderItem) *pos.OrderItem {
	if item == nil {
		return nil
	}
	coffeeBrewId := ""
	coffeeBrew := item.GetCoffeeHowToBrew()
	if &coffeeBrew != nil {
		coffeeBrewId = coffeeBrew.GetId()
	}

	return &pos.OrderItem{
		ProductId:    item.GetProductId(),
		Amount:       item.GetProductAmount(),
		Quantity:     uint32(item.Quantity),
		CoffeeBrewId: coffeeBrewId,
	}
}

func ToProtoDiscount(discount *model.Discount) *pos.Discount {
	if discount == nil {
		return nil
	}
	return &pos.Discount{
		Id:            discount.GetId(),
		Name:          discount.GetName(),
		Type:          pos.DiscountType(discount.GetDiscountType()),
		DiscountPrice: discount.GetDiscountPrice(),
	}
}

func ToProtoOrderDiscount(discount *model.Discount) *pos.OrderDiscount {
	if discount == nil {
		return nil
	}
	return &pos.OrderDiscount{
		DiscountId:    discount.GetId(),
		Type:          pos.DiscountType(discount.GetDiscountType()),
		DiscountPrice: discount.GetDiscountPrice(),
	}
}

func ToProtoOrderPayment(payment *model.OrderPayment) *pos.OrderPayment {
	if payment == nil {
		return nil
	}
	return &pos.OrderPayment{
		Id:            payment.GetId(),
		Type:          pos.OrderPayment_PaymentType(payment.GetPaymentType()),
		ReceiveAmount: payment.ReceiveAmount,
		PaymentAmount: payment.PaymentAmount,
		ChangeAmount:  payment.GetChangeAmount(),
		PaymentAt:     payment.GetPaymentAt().String(),
		UpdatedAt:     payment.GetUpdatedAt().String(),
	}
}

func ToProtoOrder(order *model.Order) *pos.Order {
	if order == nil {
		return nil
	}
	return &pos.Order{
		Id: order.GetId(),
		Items: lo.Map(order.GetOrderItems(), func(item model.OrderItem, _ int) *pos.OrderItem {
			return ToProtoOrderItem(&item)
		}),
		Discounts: lo.Map(order.GetDiscounts(), func(discount model.Discount, _ int) *pos.OrderDiscount {
			return ToProtoOrderDiscount(&discount)
		}),
		OrderType:  pos.OrderType(order.GetOrderType()),
		Payment:    ToProtoOrderPayment(order.GetPayment()),
		OrderAt:    order.GetOrderAt().String(),
		CallNumber: "", // TODO: implement
		SeatName:   "", // TODO: implement
		ClientId:   order.GetClientId(),
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

func ToOrderPaymentParam(payment *pos.OrderPayment) (*application.OrderPaymentParam, error) {
	if payment == nil {
		return nil, nil
	}
	paymentAt, err := synchro.ParseISO[tz.UTC](payment.PaymentAt)
	if err != nil {
		return nil, err
	}
	updatedAt, err := synchro.ParseISO[tz.UTC](payment.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &application.OrderPaymentParam{
		Id:            payment.Id,
		PaymentType:   model.PaymentType(payment.Type),
		ReceiveAmount: payment.ReceiveAmount,
		PaymentAmount: payment.PaymentAmount,
		ChangeAmount:  payment.ChangeAmount,
		PaymentAt:     paymentAt,
		UpdatedAt:     updatedAt,
	}, nil
}
