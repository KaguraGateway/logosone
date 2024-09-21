package grpc_server

import (
	"connectrpc.com/connect"
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
		Id:        category.GetId(),
		Name:      category.GetName(),
		CreatedAt: ToISO8601(category.GetCreatedAt()),
		UpdatedAt: ToISO8601(category.GetUpdatedAt()),
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
		CreatedAt:    ToISO8601(bean.GetCreatedAt()),
		UpdatedAt:    ToISO8601(bean.GetUpdatedAt()),
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
		CreatedAt:         ToISO8601(brew.GetCreatedAt()),
		UpdatedAt:         ToISO8601(brew.GetUpdatedAt()),
	}
}

func ToProtoStock(stock *model.Stock) *pos.Stock {
	if stock == nil {
		return nil
	}
	return &pos.Stock{
		Id:        stock.GetId(),
		Name:      stock.GetName(),
		Quantity:  uint32(stock.Quantity),
		CreatedAt: ToISO8601(stock.GetCreatedAt()),
		UpdatedAt: ToISO8601(stock.GetUpdatedAt()),
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

func ToProtoPayment(payment *model.Payment) *pos.Payment {
	if payment == nil {
		return nil
	}
	return &pos.Payment{
		Id:            payment.GetId(),
		Type:          pos.Payment_PaymentType(payment.GetPaymentType()),
		OrderIds:      payment.GetOrderIds(),
		ReceiveAmount: payment.ReceiveAmount,
		PaymentAmount: payment.PaymentAmount,
		ChangeAmount:  payment.GetChangeAmount(),
		PaymentAt:     ToISO8601(payment.GetPaymentAt()),
		UpdatedAt:     ToISO8601(payment.GetUpdatedAt()),
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
		OrderAt:    ToISO8601(order.GetOrderAt()),
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

func ToOrderParam(reqOrder *pos.OrderParam) (*application.PostOrderParam, error) {
	orderAt, err := synchro.ParseISO[tz.UTC](reqOrder.OrderAt)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return &application.PostOrderParam{
		Id: reqOrder.Id,
		OrderItems: lo.Map(reqOrder.Items, func(orderItem *pos.OrderItem, _ int) *application.OrderItemParam {
			return &application.OrderItemParam{
				ProductId:    orderItem.ProductId,
				Quantity:     uint64(orderItem.Quantity),
				Amount:       orderItem.Amount,
				CoffeeBrewId: orderItem.CoffeeBrewId,
			}
		}),
		OrderDiscounts: lo.Map(reqOrder.Discounts, func(orderDiscount *pos.OrderDiscount, _ int) *application.OrderDiscountParam {
			return &application.OrderDiscountParam{
				Id:            orderDiscount.Id,
				DiscountId:    orderDiscount.DiscountId,
				DiscountType:  model.DiscountType(orderDiscount.Type),
				DiscountPrice: orderDiscount.DiscountPrice,
			}
		}),
		OrderType: model.OrderType(reqOrder.OrderType),
		OrderAt:   orderAt,
		ClientId:  reqOrder.ClientId,
		SeatId:    reqOrder.SeatId,
	}, nil
}

func ToPaymentParam(payment *pos.Payment) (*application.PaymentParam, error) {
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
	postOrders := make([]application.PostOrderParam, 0)
	for _, postOrder := range payment.PostOrders {
		if orderParam, err := ToOrderParam(postOrder); err != nil {
			return nil, err
		} else {
			postOrders = append(postOrders, *orderParam)
		}
	}
	return &application.PaymentParam{
		Id:            payment.Id,
		PaymentType:   model.PaymentType(payment.Type),
		ReceiveAmount: payment.ReceiveAmount,
		PaymentAmount: payment.PaymentAmount,
		ChangeAmount:  payment.ChangeAmount,
		PaymentAt:     paymentAt,
		UpdatedAt:     updatedAt,
		OrderIds:      payment.OrderIds,
		PostOrders:    postOrders,
	}, nil
}

func ToISO8601(t synchro.Time[tz.UTC]) string {
	return t.Format("2006-01-02T15:04:05Z")
}
