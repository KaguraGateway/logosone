package model

import (
	"github.com/KaguraGateway/cafelogos-pos-backend/domain"
	"github.com/oklog/ulid/v2"
)

type Stock struct {
	id       string
	name     string
	Quantity int32
}

func NewStock(name string, quantity int32) (*Stock, error) {
	stock := &Stock{
		id:       ulid.Make().String(),
		Quantity: quantity,
	}
	if err := stock.SetName(name); err != nil {
		return nil, err
	}
	return stock, nil
}

func ReconstructStock(id string, name string, quantity int32) *Stock {
	return &Stock{
		id:       id,
		name:     name,
		Quantity: quantity,
	}
}

func (stock *Stock) GetId() string {
	return stock.id
}

func (stock *Stock) GetName() string {
	return stock.name
}

func (stock *Stock) SetName(name string) error {
	if len(name) == 0 {
		return domain.ErrStockNameInvalid
	}
	stock.name = name
	return nil
}
