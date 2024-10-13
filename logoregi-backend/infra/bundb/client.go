package bundb

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/KaguraGateway/logosone/logoregi-backend/infra/bundb/dao"
	"github.com/samber/do"
	"github.com/uptrace/bun"
)

type clientDb struct {
	db *bun.DB
}

func NewClientDb(i *do.Injector) (repository.ClientRepository, error) {
	return &clientDb{db: do.MustInvoke[*bun.DB](i)}, nil
}

func (i *clientDb) Save(ctx context.Context, client *model.Client) error {
	daoClient := &dao.Client{
		ID:   client.GetId(),
		Name: client.GetName(),
	}
	if _, err := i.db.NewInsert().Model(daoClient).On("CONFLICT (id) DO UPDATE").Set("name = EXCLUDED.name").Exec(ctx); err != nil {
		return err
	}
	return nil
}
