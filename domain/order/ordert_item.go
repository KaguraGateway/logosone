package order

import (
	"github.com/KaguraGateway/cafelogos-pos-backend/domain"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/product"
	"github.com/google/uuid"
)

type OrderItem struct {
	product         product.Product
	Quantity        uint64
	coffeeHowToBrew product.CoffeeHowToBrew
}

func NewOrderItem(product product.Product, quantity uint64) *OrderItem {
	return &OrderItem{
		product:  product,
		Quantity: quantity,
	}
}

func NewOrderItemCoffee(product product.Product, quantity uint64, brew product.CoffeeHowToBrew) (*OrderItem, error) {
	item := NewOrderItem(product, quantity)
	if err := item.SetCoffeeHowToBrew(brew); err != nil {
		return nil, err
	}
	return item, nil
}

func ReconstructOrderItem(product product.Product, quantity uint64, brew product.CoffeeHowToBrew) *OrderItem {
	return &OrderItem{
		product:         product,
		Quantity:        quantity,
		coffeeHowToBrew: brew,
	}
}

func (OrderItem *OrderItem) GetProductId() uuid.UUID {
	return OrderItem.product.GetId()
}

func (OrderItem *OrderItem) GetProductName() string {
	return OrderItem.product.ProductName.Get()
}

func (OrderItem *OrderItem) GetProductAmount() uint64 {
	if amount, err := OrderItem.product.GetAmount(); err != nil {
		return OrderItem.coffeeHowToBrew.Price
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

func (OrderItem *OrderItem) GetCoffeeHowToBrew() product.CoffeeHowToBrew {
	return OrderItem.coffeeHowToBrew
}

func (OrderItem *OrderItem) SetCoffeeHowToBrew(brew product.CoffeeHowToBrew) error {
	if OrderItem.product.ProductType != product.ProductType(product.Coffee) || OrderItem.product.CoffeeHowToBrews == nil {
		return domain.ErrProductNotCoffee
	}

	for _, v := range *OrderItem.product.CoffeeHowToBrews {
		if v.GetId() == brew.GetId() {
			OrderItem.coffeeHowToBrew = brew
			return nil
		}
	}
	return domain.ErrCoffeeHowToBrewNotFound
}
