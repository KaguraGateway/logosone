package bundb

import (
	"context"
	"database/sql"

	"github.com/KaguraGateway/logosone/orderlink-backend/domain/repository"
	"github.com/samber/do"
	"github.com/uptrace/bun"
)

type txRepositoryDb struct {
	db *bun.DB
}

func NewTxRepositoryDb(i *do.Injector) (repository.TxRepository, error) {
	return &txRepositoryDb{
		db: do.MustInvoke[*bun.DB](i),
	}, nil
}

func (r *txRepositoryDb) Transaction(ctx context.Context, fn func(ctx context.Context, tx interface{}) error) error {
	return r.db.RunInTx(ctx, &sql.TxOptions{}, func(ctx context.Context, tx bun.Tx) error {
		return fn(ctx, tx)
	})
}
