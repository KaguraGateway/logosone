package bundb

import (
	"context"

	"github.com/KaguraGateway/logosone/orderlink-backend/domain/model"
	"github.com/KaguraGateway/logosone/orderlink-backend/domain/repository"
	"github.com/KaguraGateway/logosone/orderlink-backend/infra/bundb/dao"
	"github.com/samber/do"
	"github.com/uptrace/bun"
)

type orderTicketRepositoryDb struct {
	db *bun.DB
}

func NewOrderTicketRepositoryDb(i *do.Injector) (repository.OrderTicketRepository, error) {
	return &orderTicketRepositoryDb{
		db: do.MustInvoke[*bun.DB](i),
	}, nil
}

func toDomainOrderTicket(daoOrderTicket *dao.OrderTicket) *model.OrderTicket {
	return model.RebuildOrderTicket(daoOrderTicket.OrderId, daoOrderTicket.TicketId, daoOrderTicket.TicketAddr)
}

func toDaoOrderTicket(orderTicket *model.OrderTicket) *dao.OrderTicket {
	return &dao.OrderTicket{
		OrderId:    orderTicket.OrderId(),
		TicketId:   orderTicket.TicketId(),
		TicketAddr: orderTicket.TicketAddr(),
	}
}

func (r *orderTicketRepositoryDb) FindByOrderId(ctx context.Context, orderId string) (*model.OrderTicket, error) {
	daoOrderTicket := new(dao.OrderTicket)
	if err := r.db.NewSelect().Model(daoOrderTicket).Where("order_id = ?", orderId).Scan(ctx); err != nil {
		return nil, err
	}
	return toDomainOrderTicket(daoOrderTicket), nil
}

func orderTicketSaveQuery(q *bun.InsertQuery) *bun.InsertQuery {
	return q.Ignore()
}

func (r *orderTicketRepositoryDb) SaveTx(ctx context.Context, tx interface{}, orderTicket *model.OrderTicket) error {
	bunTx := tx.(bun.Tx)
	daoOrderTicket := toDaoOrderTicket(orderTicket)
	if _, err := orderTicketSaveQuery(bunTx.NewInsert().Model(daoOrderTicket)).Exec(ctx); err != nil {
		return err
	}
	return nil
}
