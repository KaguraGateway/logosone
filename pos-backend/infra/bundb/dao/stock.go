package dao

import "time"

type Stock struct {
	ID        string    `bun:",pk"`
	Name      string    `bun:",notnull"`
	Quantity  int       `bun:",notnull"`
	CreatedAt time.Time `bun:",nullzero,notnull"`
	UpdatedAt time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	Products []*Product `bun:"rel:has-many"`
}
