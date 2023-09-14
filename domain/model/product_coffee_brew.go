package model

import (
	"github.com/KaguraGateway/cafelogos-pos-backend/domain"
	"github.com/google/uuid"
)

type ProductCoffeeBrew struct {
	id                uuid.UUID
	productId         uuid.UUID
	name              string
	BeanQuantityGrams uint32
	Amount            uint64
}
type ProductCoffeeBrews []*ProductCoffeeBrew

func NewProductCoffeeBrew(productId uuid.UUID, name string, beanQuantityGrams uint32, amount uint64) (*ProductCoffeeBrew, error) {
	brew := &ProductCoffeeBrew{
		id:                uuid.UUID{},
		productId:         productId,
		BeanQuantityGrams: beanQuantityGrams,
		Amount:            amount,
	}
	if err := brew.SetName(name); err != nil {
		return nil, err
	}
	return brew, nil
}

func ReconstructProductCoffeeBrew(id uuid.UUID, productId uuid.UUID, name string, beanQuantityGrams uint32, amount uint64) *ProductCoffeeBrew {
	return &ProductCoffeeBrew{
		id:                id,
		productId:         productId,
		name:              name,
		BeanQuantityGrams: beanQuantityGrams,
		Amount:            amount,
	}
}

func (coffeeHowToBrew *ProductCoffeeBrew) GetId() uuid.UUID {
	return coffeeHowToBrew.id
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
