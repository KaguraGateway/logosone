package bundb

import (
	"context"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/KaguraGateway/cafelogos-pos-backend/infra/bundb/dao"
	"github.com/samber/do"
	"github.com/samber/lo"
	"github.com/uptrace/bun"
)

type stockDb struct {
	db *bun.DB
}

func NewStockDb(i *do.Injector) (repository.StockRepository, error) {
	return &stockDb{db: do.MustInvoke[*bun.DB](i)}, nil
}

func toStock(daoStock dao.Stock) *model.Stock {
	return model.ReconstructStock(daoStock.ID, daoStock.Name, int32(daoStock.Quantity))
}

func (i *stockDb) FindAll(ctx context.Context) ([]*model.Stock, error) {
	daoStocks := make([]dao.Stock, 0)
	if err := i.db.NewSelect().Model(&daoStocks).Scan(ctx); err != nil {
		return nil, err
	}
	stocks := lo.Map(daoStocks, func(daoStock dao.Stock, _ int) *model.Stock {
		return toStock(daoStock)
	})
	return stocks, nil
}

func (i *stockDb) FindById(ctx context.Context, id string) (*model.Stock, error) {
	daoStock := new(dao.Stock)
	if err := i.db.NewSelect().Model(daoStock).Where("id = ?", id).Scan(ctx); err != nil {
		return nil, err
	}
	return toStock(*daoStock), nil
}

func (i *stockDb) Save(ctx context.Context, stock *model.Stock) error {
	daoStock := &dao.Stock{
		ID:       stock.GetId(),
		Name:     stock.GetName(),
		Quantity: int(stock.Quantity),
	}
	if _, err := i.db.NewInsert().Model(daoStock).On("CONFLICT (id) DO UPDATE").Set("name = EXCLUDED.name").Set("quantity = EXCLUDED.quantity").Exec(ctx); err != nil {
		return err
	}
	return nil
}
