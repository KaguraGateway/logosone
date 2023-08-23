package product

import (
	"github.com/KaguraGateway/cafelogos-pos-backend/domain"
	"github.com/google/uuid"
)

type CoffeeHowToBrew struct {
	id                uuid.UUID
	name              string
	BeanQuantityGrams uint32
	Price             uint64
}
type CoffeeHowToBrews []*CoffeeHowToBrew

func NewCoffeeHowToBrew(name string, beanQuantityGrams uint32, price uint64) (error, *CoffeeHowToBrew) {
	brew := &CoffeeHowToBrew{
		id:                uuid.UUID{},
		BeanQuantityGrams: beanQuantityGrams,
		Price:             price,
	}
	if err := brew.SetName(name); err != nil {
		return err, nil
	}
	return nil, brew
}

func ReconstructCoffeeHowToBrew(id uuid.UUID, name string, beanQuantityGrams uint32, price uint64) *CoffeeHowToBrew {
	return &CoffeeHowToBrew{
		id:                id,
		name:              name,
		BeanQuantityGrams: beanQuantityGrams,
		Price:             price,
	}
}

func (coffeeHowToBrew *CoffeeHowToBrew) GetId() uuid.UUID {
	return coffeeHowToBrew.id
}

func (coffeeHowToBrew *CoffeeHowToBrew) GetName() string {
	return coffeeHowToBrew.name
}

func (coffeeHowToBrew *CoffeeHowToBrew) SetName(name string) error {
	if len(name) == 0 {
		return domain.ErrCoffeeHowToBrewNameInvalid
	}
	coffeeHowToBrew.name = name
	return nil
}
