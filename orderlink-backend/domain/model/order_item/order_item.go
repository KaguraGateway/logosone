package orderitem

import (
	"time"

	"github.com/KaguraGateway/logosone/orderlink-backend/domain"
	"github.com/oklog/ulid/v2"
)

/**
 * LogoREGIと異なり、この１ドメインが１個を示すので個数カラムはない
 */
type OrderItem struct {
	id               string
	orderId          string
	productId        string
	coffeeBrewId     *string
	status           OrderItemStatus
	cookingStartTime *time.Time
	cookingEndTime   *time.Time
}

func NewOrderItem(orderId string, productId string, coffeeBrewId *string) (*OrderItem, error) {
	if len(orderId) == 0 {
		return nil, domain.ErrInvalidOrderId
	}

	return &OrderItem{
		id:               ulid.Make().String(),
		orderId:          orderId,
		productId:        productId,
		coffeeBrewId:     coffeeBrewId,
		status:           OrderItemStatus(NotYet),
		cookingStartTime: nil,
		cookingEndTime:   nil,
	}, nil
}

func RebuildOrderItem(id string, orderId string, productId string, coffeeBrewId *string, status OrderItemStatus, cookingStartTime *time.Time, cookingEndTime *time.Time) *OrderItem {
	return &OrderItem{
		id:               id,
		orderId:          orderId,
		productId:        productId,
		coffeeBrewId:     coffeeBrewId,
		status:           status,
		cookingStartTime: cookingStartTime,
		cookingEndTime:   cookingEndTime,
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

func (o *OrderItem) CoffeeBrewId() *string {
	return o.coffeeBrewId
}

func (o *OrderItem) Status() OrderItemStatus {
	return o.status
}

func (o *OrderItem) UpdateStatus(status OrderItemStatus) {
	o.status = status
}

func (o *OrderItem) CookingStartTime() *time.Time {
	return o.cookingStartTime
}

func (o *OrderItem) CookingEndTime() *time.Time {
	return o.cookingEndTime
}

func (o *OrderItem) SetCookingStartTime(t time.Time) {
	o.cookingStartTime = &t
}

func (o *OrderItem) SetCookingEndTime(t time.Time) {
	o.cookingEndTime = &t
}
