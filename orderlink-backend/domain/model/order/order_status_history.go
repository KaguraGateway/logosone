package order

import (
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/oklog/ulid/v2"
)

type OrderStatusHistory struct {
	id        string
	status    OrderStatus
	createdAt synchro.Time[tz.UTC]
}

func NewOrderStatusHistory(status OrderStatus) OrderStatusHistory {
	return OrderStatusHistory{
		id:        ulid.Make().String(),
		status:    status,
		createdAt: synchro.Now[tz.UTC](),
	}
}

func RebuildOrderStatusHistory(id string, status OrderStatus, createdAt synchro.Time[tz.UTC]) OrderStatusHistory {
	return OrderStatusHistory{
		id:        id,
		status:    status,
		createdAt: createdAt,
	}
}

func (o OrderStatusHistory) ID() string {
	return o.id
}

func (o OrderStatusHistory) Status() OrderStatus {
	return o.status
}

func (o OrderStatusHistory) CreatedAt() synchro.Time[tz.UTC] {
	return o.createdAt
}
