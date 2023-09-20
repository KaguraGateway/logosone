package model

import (
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain"
	"github.com/oklog/ulid/v2"
)

/**
 * LogoREGIと異なり、この１ドメインが１個を示すので個数カラムはない
 */
type OrderItem struct {
	id           string
	orderId      string
	productId    string
	coffeeBrewId *string
	status       OrderItemStatus
}

func NewOrderItem(orderId string, productId string, coffeeBrewId *string) (*OrderItem, error) {
	if len(orderId) == 0 {
		return nil, domain.ErrInvalidOrderId
	}

	return &OrderItem{
		id:           ulid.Make().String(),
		orderId:      orderId,
		productId:    productId,
		coffeeBrewId: coffeeBrewId,
		status:       OrderItemStatus(NotYet),
	}, nil
}

func RebuildOrderItem(id string, orderId string, productId string, coffeeBrewId *string, status OrderItemStatus) *OrderItem {
	return &OrderItem{
		id:           id,
		orderId:      orderId,
		productId:    productId,
		coffeeBrewId: coffeeBrewId,
		status:       status,
	}
}

func (o *OrderItem) Id() string {
	return o.id
}

func (o *OrderItem) OrderId() string {
	return o.orderId
}

func (o *OrderItem) ProductId() string {
	return o.productId
}

func (o *OrderItem) CoffeeBrew() *string {
	return o.coffeeBrewId
}

func (o *OrderItem) Status() OrderItemStatus {
	return o.status
}
