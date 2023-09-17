package model

import (
	"github.com/KaguraGateway/cafelogos-pos-backend/domain"
)

type OrderItem struct {
	product    Product
	Quantity   uint64
	coffeeBrew ProductCoffeeBrew
}

func NewOrderItem(product Product, quantity uint64) *OrderItem {
	return &OrderItem{
		product:  product,
		Quantity: quantity,
	}
}

func NewOrderItemCoffee(product Product, quantity uint64, brew ProductCoffeeBrew) (*OrderItem, error) {
	item := NewOrderItem(product, quantity)
	if err := item.SetCoffeeHowToBrew(brew); err != nil {
		return nil, err
	}
	return item, nil
}

func ReconstructOrderItem(product Product, quantity uint64, brew ProductCoffeeBrew) *OrderItem {
	return &OrderItem{
		product:    product,
		Quantity:   quantity,
		coffeeBrew: brew,
	}
}

func (OrderItem *OrderItem) GetProductId() string {
	return OrderItem.product.GetId()
}

func (OrderItem *OrderItem) GetProductName() string {
	return OrderItem.product.ProductName.Get()
}

func (OrderItem *OrderItem) GetProductAmount() uint64 {
	if amount, err := OrderItem.product.GetAmount(); err != nil {
		return OrderItem.coffeeBrew.Amount
	} else {
		return amount
	}
}

func (OrderItem *OrderItem) GetTotalQunatity() uint64 {
	return OrderItem.GetProductAmount() * OrderItem.Quantity
}

func (OrderItem *OrderItem) GetTotalAmount() uint64 {
	return OrderItem.GetProductAmount() * OrderItem.Quantity
}

func (OrderItem *OrderItem) GetCoffeeHowToBrew() ProductCoffeeBrew {
	return OrderItem.coffeeBrew
}

func (OrderItem *OrderItem) SetCoffeeHowToBrew(brew ProductCoffeeBrew) error {
	if OrderItem.product.ProductType != ProductType(Coffee) || OrderItem.product.CoffeeBrews == nil {
		return domain.ErrProductNotCoffee
	}

	for _, v := range *OrderItem.product.CoffeeBrews {
		if v.GetId() == brew.GetId() {
			OrderItem.coffeeBrew = brew
			return nil
		}
	}
	return domain.ErrProductCoffeeBrewNotFound
}
