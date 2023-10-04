package bundb

import (
	"context"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/KaguraGateway/cafelogos-pos-backend/infra/bundb/dao"
	"github.com/samber/do"
	"github.com/uptrace/bun"
)

type orderDiscountDb struct {
	db *bun.DB
}

func NewOrderDiscountDb(i *do.Injector) (repository.OrderDiscountRepository, error) {
	return &orderDiscountDb{db: do.MustInvoke[*bun.DB](i)}, nil
}

func (i *orderDiscountDb) SaveTx(ctx context.Context, tx interface{}, orderDiscount *model.OrderDiscount) error {
	bunTx := tx.(*bun.Tx)
	daoOrderDiscount := &dao.OrderDiscount{
		ID:         orderDiscount.GetId(),
		DiscountID: orderDiscount.GetDiscountId(),
		OrderID:    orderDiscount.GetOrderId(),
	}
	if _, err := bunTx.NewInsert().Model(daoOrderDiscount).Ignore().On("CONFLICT (id) DO UPDATE").Set("discount_id = EXCLUDED.discount_id").Set("order_id = EXCLUDED.order_id").Exec(ctx); err != nil {
		return err
	}
	return nil
}
