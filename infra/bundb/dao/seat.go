package dao

import "time"

type Seat struct {
	ID        string    `bun:",pk"`
	Name      string    `bun:",notnull"`
	CreatedAt time.Time `bun:",nullzero,notnull"`
	UpdatedAt time.Time `bun:",nullzero,notnull,default:current_timestamp"`
}
