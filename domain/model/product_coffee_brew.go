package model

import "github.com/KaguraGateway/cafelogos-orderlink-backend/domain"

type ProductCoffeeBrew struct {
	id   string
	name string
}

func NewProductCoffeeBrew(id string, name string) (*ProductCoffeeBrew, error) {
	if len(id) == 0 {
		return nil, domain.ErrInvalidProductCoffeeBrewId
	} else if len(name) == 0 {
		return nil, domain.ErrInvalidProductCoffeeBrewName
	}

	return &ProductCoffeeBrew{
		id:   id,
		name: name,
	}, nil
}

func RebuildProductCoffeeBrew(id string, name string) *ProductCoffeeBrew {
	return &ProductCoffeeBrew{
		id:   id,
		name: name,
	}
}

func (p *ProductCoffeeBrew) Id() string {
	return p.id
}

func (p *ProductCoffeeBrew) Name() string {
	return p.name
}
