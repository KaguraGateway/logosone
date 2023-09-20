package model

import "github.com/oklog/ulid/v2"

/**
 * LogoREGIと異なり、この１ドメインが１個を示すので個数カラムはない
 */
type OrderItem struct {
	id         string
	orderId    string
	product    Product
	coffeeBrew ProductCoffeeBrew
	status     OrderItemStatus
}

func NewOrderItem(orderId string, product Product, coffeeBrew ProductCoffeeBrew) *OrderItem {
	return &OrderItem{
		id:         ulid.Make().String(),
		orderId:    orderId,
		product:    product,
		coffeeBrew: coffeeBrew,
		status:     OrderItemStatus(NotYet),
	}
}

func RebuildOrderItem(id string, orderId string, product Product, coffeeBrew ProductCoffeeBrew, status OrderItemStatus) *OrderItem {
	return &OrderItem{
		id:         id,
		orderId:    orderId,
		product:    product,
		coffeeBrew: coffeeBrew,
		status:     status,
	}
}

func (o *OrderItem) Id() string {
	return o.id
}

func (o *OrderItem) OrderId() string {
	return o.orderId
}

func (o *OrderItem) Product() Product {
	return o.product
}

func (o *OrderItem) CoffeeBrew() ProductCoffeeBrew {
	return o.coffeeBrew
}

func (o *OrderItem) Status() OrderItemStatus {
	return o.status
}
