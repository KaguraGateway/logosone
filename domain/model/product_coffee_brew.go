package model

import (
	"github.com/KaguraGateway/cafelogos-pos-backend/domain"
	"github.com/oklog/ulid/v2"
)

type ProductCoffeeBrew struct {
	id                string
	productId         string
	name              string
	BeanQuantityGrams uint32
	Amount            uint64
}

func NewProductCoffeeBrew(productId string, name string, beanQuantityGrams uint32, amount uint64) (*ProductCoffeeBrew, error) {
	brew := &ProductCoffeeBrew{
		id:                ulid.Make().String(),
		productId:         productId,
		BeanQuantityGrams: beanQuantityGrams,
		Amount:            amount,
	}
	if err := brew.SetName(name); err != nil {
		return nil, err
	}
	return brew, nil
}

func ReconstructProductCoffeeBrew(id string, productId string, name string, beanQuantityGrams uint32, amount uint64) *ProductCoffeeBrew {
	return &ProductCoffeeBrew{
		id:                id,
		productId:         productId,
		name:              name,
		BeanQuantityGrams: beanQuantityGrams,
		Amount:            amount,
	}
}

func (coffeeHowToBrew *ProductCoffeeBrew) GetId() string {
	return coffeeHowToBrew.id
}

func (coffeeHowToBrew *ProductCoffeeBrew) GetProductId() string {
	return coffeeHowToBrew.productId
}

func (coffeeHowToBrew *ProductCoffeeBrew) GetName() string {
	return coffeeHowToBrew.name
}

func (coffeeHowToBrew *ProductCoffeeBrew) SetName(name string) error {
	if len(name) == 0 {
		return domain.ErrProductCoffeeBrewNameInvalid
	}
	coffeeHowToBrew.name = name
	return nil
}
