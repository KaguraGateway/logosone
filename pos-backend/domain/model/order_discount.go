package model

type OrderDiscount struct {
	id         string
	orderId    string
	discountId string
}

func ReconstructOrderDiscount(id string, orderId string, discountId string) *OrderDiscount {
	return &OrderDiscount{
		id:         id,
		orderId:    orderId,
		discountId: discountId,
	}
}

func (discount *OrderDiscount) GetId() string {
	return discount.id
}

func (discount *OrderDiscount) GetOrderId() string {
	return discount.orderId
}

func (discount *OrderDiscount) GetDiscountId() string {
	return discount.discountId
}
