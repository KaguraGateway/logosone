package repository

import "context"

type TxRepository interface {
	Transaction(ctx context.Context, f func(ctx context.Context, tx interface{}) error) error
}
