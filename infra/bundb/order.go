package bundb

import (
	"context"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/KaguraGateway/cafelogos-pos-backend/infra/bundb/dao"
	"github.com/samber/do"
	"github.com/uptrace/bun"
)

type orderDb struct {
	db *bun.DB
}

func NewOrderDb(i *do.Injector) (repository.OrderRepository, error) {
	return &orderDb{db: do.MustInvoke[*bun.DB](i)}, nil
}

func (i *orderDb) SaveTx(ctx context.Context, tx interface{}, order *model.Order) error {
	bunTx := tx.(*bun.Tx)
	daoOrder := &dao.Order{
		ID:        order.GetId(),
		OrderType: uint(order.GetOrderType()),
		OrderAt:   order.GetOrderAt().StdTime(),
		ClientID:  order.GetClientId(),
		SeatID:    order.GetSeatId(),
	}
	if _, err := bunTx.NewInsert().Model(daoOrder).On("CONFLICT (id) DO UPDATE").Set("order_type = EXCLUDED.order_type").Set("order_at = EXCLUDED.order_at").Set("client_id = EXCLUDED.client_id").Set("seat_id = EXCLUDED.seat_id").Exec(ctx); err != nil {
		return err
	}
	return nil
}

func (i *orderDb) Delete(ctx context.Context, id string) error {
	if _, err := i.db.NewDelete().Model(&dao.Order{}).Where("id = ?", id).Exec(ctx); err != nil {
		return err
	}
	return nil
}
