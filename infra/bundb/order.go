package bundb

import (
	"context"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model/order"
	orderitem "github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model/order_item"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/repository"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/infra/bundb/dao"
	"github.com/samber/do"
	"github.com/samber/lo"
	"github.com/uptrace/bun"
)

type orderRepositoryDb struct {
	db *bun.DB
}

func NewOrderRepositoryDb(i *do.Injector) (repository.OrderRepository, error) {
	return &orderRepositoryDb{
		db: do.MustInvoke[*bun.DB](i),
	}, nil
}

func toDomainOrder(daoOrder *dao.Order) *order.Order {
	return order.RebuildOrder(daoOrder.Id, lo.Map(daoOrder.OrderItems, func(orderItem *dao.OrderItem, _ int) orderitem.OrderItem {
		return *toDomainOrderItem(orderItem)
	}), daoOrder.OrderAt, order.OrderType(daoOrder.OrderType), order.OrderStatus(daoOrder.Status), daoOrder.SeatName)
}

func toDaoOrder(order *order.Order) *dao.Order {
	return &dao.Order{
		Id:        order.Id(),
		OrderAt:   order.OrderAt(),
		OrderType: uint(order.OrderType()),
		Status:    uint(order.Status()),
		SeatName:  order.SeatName(),
	}
}

func (r *orderRepositoryDb) FindById(ctx context.Context, id string) (*order.Order, error) {
	daoOrder := new(dao.Order)
	if err := r.db.NewSelect().Model(daoOrder).Where("id = ?", id).Scan(ctx); err != nil {
		return nil, err
	}
	return toDomainOrder(daoOrder), nil
}

func orderSaveQuery(q *bun.InsertQuery) *bun.InsertQuery {
	return q.On("CONFLICT (id) DO UPDATE").Set("status = EXCLUDED.status")
}

func (r *orderRepositoryDb) Save(ctx context.Context, order *order.Order) error {
	daoOrder := toDaoOrder(order)
	if _, err := orderSaveQuery(r.db.NewInsert().Model(daoOrder)).Exec(ctx); err != nil {
		return err
	}
	return nil
}

func (r *orderRepositoryDb) SaveTx(ctx context.Context, tx interface{}, order *order.Order) error {
	bunTx := tx.(*bun.Tx)
	daoOrder := toDaoOrder(order)
	if _, err := orderSaveQuery(bunTx.NewInsert().Model(daoOrder)).Exec(ctx); err != nil {
		return err
	}
	return nil
}
