package product

import (
	"github.com/KaguraGateway/cafelogos-pos-backend/domain"
	"github.com/google/uuid"
)

type Stock struct {
	id       uuid.UUID
	name     string
	Quantity int32
}

func NewStock(name string, quantity int32) (error, *Stock) {
	stock := &Stock{
		id:       uuid.UUID{},
		Quantity: quantity,
	}
	if err := stock.SetName(name); err != nil {
		return err, nil
	}
	return nil, stock
}

func ReconstructStock(id uuid.UUID, name string, quantity int32) *Stock {
	return &Stock{
		id:       id,
		name:     name,
		Quantity: quantity,
	}
}

func (stock *Stock) GetId() uuid.UUID {
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
