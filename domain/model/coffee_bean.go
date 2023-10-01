package model

import (
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain"
	"github.com/oklog/ulid/v2"
)

type CoffeeBean struct {
	id           string
	name         string
	GramQuantity int
	createdAt    synchro.Time[tz.UTC]
	updatedAt    synchro.Time[tz.UTC]
}

func NewCoffeeBean(name string, gramQuantity int) (*CoffeeBean, error) {
	bean := &CoffeeBean{
		id:           ulid.Make().String(),
		GramQuantity: gramQuantity,
		createdAt:    synchro.Now[tz.UTC](),
		updatedAt:    synchro.Now[tz.UTC](),
	}
	if err := bean.SetName(name); err != nil {
		return nil, err
	}
	return bean, nil
}

func ReconstructCoffeeBean(id string, name string, gramQuantity int, createdAt synchro.Time[tz.UTC], updatedAt synchro.Time[tz.UTC]) *CoffeeBean {
	return &CoffeeBean{
		id:           id,
		name:         name,
		GramQuantity: gramQuantity,
		createdAt:    createdAt,
		updatedAt:    updatedAt,
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

func (coffeeBean *CoffeeBean) GetCreatedAt() synchro.Time[tz.UTC] {
	return coffeeBean.createdAt
}

func (coffeeBean *CoffeeBean) GetUpdatedAt() synchro.Time[tz.UTC] {
	return coffeeBean.updatedAt
}
