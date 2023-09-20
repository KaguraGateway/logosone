package bundb

import (
	"context"

	orderitem "github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model/order_item"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/repository"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/infra/bundb/dao"
	"github.com/samber/do"
	"github.com/uptrace/bun"
)

type orderItemRepositoryDb struct {
	db *bun.DB
}

func NewOrderItemRepositoryDb(i *do.Injector) (repository.OrderItemRepository, error) {
	return &orderItemRepositoryDb{
		db: do.MustInvoke[*bun.DB](i),
	}, nil
}

func toDomainOrderItem(daoOrderItem *dao.OrderItem) *orderitem.OrderItem {
	return orderitem.RebuildOrderItem(daoOrderItem.Id, daoOrderItem.OrderId, daoOrderItem.ProductId, &daoOrderItem.ProductId, orderitem.OrderItemStatus(daoOrderItem.Order.Status))
}

func toDaoOrderItem(orderItem *orderitem.OrderItem) *dao.OrderItem {
	return &dao.OrderItem{
		Id:        orderItem.Id(),
		OrderId:   orderItem.OrderId(),
		ProductId: orderItem.ProductId(),
		Status:    uint(orderItem.Status()),
	}
}

func (r *orderItemRepositoryDb) FindById(ctx context.Context, id string) (*orderitem.OrderItem, error) {
	daoOrderItem := new(dao.OrderItem)
	if err := r.db.NewSelect().Model(daoOrderItem).Where("id = ?", id).Scan(ctx); err != nil {
		return nil, err
	}
	return toDomainOrderItem(daoOrderItem), nil
}

func orderItemSaveQuery(q *bun.InsertQuery) *bun.InsertQuery {
	return q.On("CONFLICT (id) DO UPDATE").Set("status = EXCLUDED.status")
}

func (r *orderItemRepositoryDb) Save(ctx context.Context, orderItem *orderitem.OrderItem) error {
	daoOrderItem := toDaoOrderItem(orderItem)
	if _, err := orderItemSaveQuery(r.db.NewInsert().Model(daoOrderItem)).Exec(ctx); err != nil {
		return err
	}
	return nil
}

func (r *orderItemRepositoryDb) SaveTx(ctx context.Context, tx interface{}, orderItem *orderitem.OrderItem) error {
	bunTx := tx.(*bun.Tx)
	daoOrderItem := toDaoOrderItem(orderItem)
	if _, err := orderItemSaveQuery(bunTx.NewInsert().Model(daoOrderItem)).Exec(ctx); err != nil {
		return err
	}
	return nil
}
