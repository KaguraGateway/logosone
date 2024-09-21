package model

import (
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
)

type Denomination struct {
	denomination uint64
	clientId     string
	Amount       uint64
	createdAt    synchro.Time[tz.UTC]
	updatedAt    synchro.Time[tz.UTC]
}

func NewDenomination(denomination uint64, clientId string, amount uint64) *Denomination {
	return &Denomination{
		denomination: denomination,
		clientId:     clientId,
		Amount:       amount,
		createdAt:    synchro.Now[tz.UTC](),
		updatedAt:    synchro.Now[tz.UTC](),
	}
}

func ReconstructDenomination(denomination uint64, clientId string, amount uint64, createdAt synchro.Time[tz.UTC], updatedAt synchro.Time[tz.UTC]) *Denomination {
	return &Denomination{
		denomination: denomination,
		clientId:     clientId,
		Amount:       amount,
		createdAt:    createdAt,
		updatedAt:    updatedAt,
	}
}

func (denomination *Denomination) GetDenomination() uint64 {
	return denomination.denomination
}

func (denomination *Denomination) GetClientId() string {
	return denomination.clientId
}

func (denomination *Denomination) GetCreatedAt() synchro.Time[tz.UTC] {
	return denomination.createdAt
}

func (denomination *Denomination) GetUpdatedAt() synchro.Time[tz.UTC] {
	return denomination.updatedAt
}
