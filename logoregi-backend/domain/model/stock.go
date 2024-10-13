package model

import (
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain"
	"github.com/oklog/ulid/v2"
)

type Stock struct {
	id        string
	name      string
	Quantity  int32
	createdAt synchro.Time[tz.UTC]
	updatedAt synchro.Time[tz.UTC]
}

func NewStock(name string, quantity int32) (*Stock, error) {
	stock := &Stock{
		id:        ulid.Make().String(),
		Quantity:  quantity,
		createdAt: synchro.Now[tz.UTC](),
		updatedAt: synchro.Now[tz.UTC](),
	}
	if err := stock.SetName(name); err != nil {
		return nil, err
	}
	return stock, nil
}

func ReconstructStock(id string, name string, quantity int32, createdAt synchro.Time[tz.UTC], updatedAt synchro.Time[tz.UTC]) *Stock {
	return &Stock{
		id:        id,
		name:      name,
		Quantity:  quantity,
		createdAt: createdAt,
		updatedAt: updatedAt,
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

func (stock *Stock) GetCreatedAt() synchro.Time[tz.UTC] {
	return stock.createdAt
}

func (stock *Stock) GetUpdatedAt() synchro.Time[tz.UTC] {
	return stock.updatedAt
}
