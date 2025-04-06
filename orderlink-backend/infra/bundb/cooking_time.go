package bundb

import (
	"context"

	cookingtime "github.com/KaguraGateway/logosone/orderlink-backend/domain/model/cooking_time"
	"github.com/KaguraGateway/logosone/orderlink-backend/domain/repository"
	"github.com/KaguraGateway/logosone/orderlink-backend/infra/bundb/dao"
	"github.com/samber/do"
	"github.com/uptrace/bun"
)

type cookingTimeRepositoryDb struct {
	db *bun.DB
}

func NewCookingTimeRepositoryDb(i *do.Injector) (repository.CookingTimeRepository, error) {
	return &cookingTimeRepositoryDb{
		db: do.MustInvoke[*bun.DB](i),
	}, nil
}

func toDomainCookingTime(daoCookingTime *dao.CookingTime) *cookingtime.CookingTime {
	return cookingtime.RebuildCookingTime(daoCookingTime.ProductId, daoCookingTime.AverageCookingTime, daoCookingTime.Count)
}

func toDaoCookingTime(cookingTime *cookingtime.CookingTime) *dao.CookingTime {
	return &dao.CookingTime{
		ProductId:         cookingTime.ProductId(),
		AverageCookingTime: cookingTime.AverageCookingTime(),
		Count:             cookingTime.Count(),
	}
}

func (r *cookingTimeRepositoryDb) FindByProductId(ctx context.Context, productId string) (*cookingtime.CookingTime, error) {
	daoCookingTime := new(dao.CookingTime)
	if err := r.db.NewSelect().Model(daoCookingTime).Where("product_id = ?", productId).Scan(ctx); err != nil {
		if err == bun.ErrNoRows {
			return cookingtime.NewCookingTime(productId), nil
		}
		return nil, err
	}
	return toDomainCookingTime(daoCookingTime), nil
}

func cookingTimeSaveQuery(q *bun.InsertQuery) *bun.InsertQuery {
	return q.On("CONFLICT (product_id) DO UPDATE").
		Set("average_cooking_time = EXCLUDED.average_cooking_time").
		Set("count = EXCLUDED.count")
}

func (r *cookingTimeRepositoryDb) Save(ctx context.Context, cookingTime *cookingtime.CookingTime) error {
	daoCookingTime := toDaoCookingTime(cookingTime)
	if _, err := cookingTimeSaveQuery(r.db.NewInsert().Model(daoCookingTime)).Exec(ctx); err != nil {
		return err
	}
	return nil
}

func (r *cookingTimeRepositoryDb) SaveTx(ctx context.Context, tx interface{}, cookingTime *cookingtime.CookingTime) error {
	bunTx := tx.(bun.Tx)
	daoCookingTime := toDaoCookingTime(cookingTime)
	if _, err := cookingTimeSaveQuery(bunTx.NewInsert().Model(daoCookingTime)).Exec(ctx); err != nil {
		return err
	}
	return nil
}

func (r *cookingTimeRepositoryDb) FindAll(ctx context.Context) ([]*cookingtime.CookingTime, error) {
	var daoCookingTimes []dao.CookingTime
	if err := r.db.NewSelect().Model(&daoCookingTimes).Scan(ctx); err != nil {
		return nil, err
	}
	
	result := make([]*cookingtime.CookingTime, len(daoCookingTimes))
	for i, ct := range daoCookingTimes {
		result[i] = toDomainCookingTime(&ct)
	}
	
	return result, nil
}
