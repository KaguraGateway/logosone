package dao

import "time"

type Denomination struct {
	Denomination uint      `bun:",pk"`
	ClientId     string    `bun:",pk"`
	Client       *Client   `bun:"rel:belongs-to,join:client_id=id"`
	Amount       uint64    `bun:",notnull"`
	CreatedAt    time.Time `bun:",nullzero,notnull"`
	UpdatedAt    time.Time `bun:",nullzero,notnull,default:current_timestamp"`
}
