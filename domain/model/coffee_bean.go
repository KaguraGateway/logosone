package model

import (
	"github.com/KaguraGateway/cafelogos-pos-backend/domain"
	"github.com/oklog/ulid/v2"
)

type CoffeeBean struct {
	id           string
	name         string
	GramQuantity int
}

func NewCoffeeBean(name string, gramQuantity int) (*CoffeeBean, error) {
	bean := &CoffeeBean{
		id:           ulid.Make().String(),
		GramQuantity: gramQuantity,
	}
	if err := bean.SetName(name); err != nil {
		return nil, err
	}
	return bean, nil
}

func ReconstructCoffeeBean(id string, name string, gramQuantity int) *CoffeeBean {
	return &CoffeeBean{
		id:           id,
		name:         name,
		GramQuantity: gramQuantity,
	}
}

func (coffeeBean *CoffeeBean) GetId() string {
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
