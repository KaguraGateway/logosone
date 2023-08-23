package product

import (
	"github.com/KaguraGateway/cafelogos-pos-backend/domain"
	"github.com/google/uuid"
)

type CoffeeBean struct {
	id           uuid.UUID
	name         string
	GramQuantity int
}

func NewCoffeeBean(name string, gramQuantity int) (error, *CoffeeBean) {
	bean := &CoffeeBean{
		id:           uuid.UUID{},
		GramQuantity: gramQuantity,
	}
	if err := bean.SetName(name); err != nil {
		return err, nil
	}
	return nil, bean
}

func ReconstructCoffeeBean(id uuid.UUID, name string, gramQuantity int) *CoffeeBean {
	return &CoffeeBean{
		id:           id,
		name:         name,
		GramQuantity: gramQuantity,
	}
}

func (coffeeBean *CoffeeBean) GetId() uuid.UUID {
	return coffeeBean.id
}

func (coffeeBean *CoffeeBean) GetName() string {
	return coffeeBean.name
}

func (coffeeBean *CoffeeBean) SetName(name string) error {
	if len(name) == 0 {
		return domain.ErrCoffeeBeanNameInvalid
	}
	coffeeBean.name = name
	return nil
}
