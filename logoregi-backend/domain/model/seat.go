package model

import (
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain"
	"github.com/oklog/ulid/v2"
)

type Seat struct {
	id        string
	name      string
	createdAt synchro.Time[tz.UTC]
	updatedAt synchro.Time[tz.UTC]
}

func NewSeat(name string) (*Seat, error) {
	seat := &Seat{
		id:        ulid.Make().String(),
		createdAt: synchro.Now[tz.UTC](),
		updatedAt: synchro.Now[tz.UTC](),
	}
	if err := seat.SetName(name); err != nil {
		return nil, err
	}
	return seat, nil
}

func ReconstructSeat(id string, name string, createdAt synchro.Time[tz.UTC], updatedAt synchro.Time[tz.UTC]) *Seat {
	return &Seat{
		id:        id,
		name:      name,
		createdAt: createdAt,
		updatedAt: updatedAt,
	}
}

func (seat *Seat) GetId() string {
	return seat.id
}

func (seat *Seat) GetName() string {
	return seat.name
}

func (seat *Seat) SetName(name string) error {
	if len(name) == 0 {
		return domain.ErrSeatNameInvalid
	}
	seat.name = name
	return nil
}

func (seat *Seat) GetCreatedAt() synchro.Time[tz.UTC] {
	return seat.createdAt
}

func (seat *Seat) GetUpdatedAt() synchro.Time[tz.UTC] {
	return seat.updatedAt
}
