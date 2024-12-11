package dao

import "time"

type PaymentExternal struct {
	ID                string `bun:",pk"`
	PaymentId         string `bun:",notnull"`
	PaymentType       string `bun:",notnull"`
	Status            string `bun:",notnull"`
	ExternalServiceId string `bun:",notnull"`
	ExternalDeviceId  string
	CreatedAt         time.Time `bun:",notnull"`
	UpdatedAt         time.Time `bun:",notnull"`
	PaidAt            time.Time

	Payment *Payment `bun:"rel:belongs-to"`
}
