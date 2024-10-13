package bundb

import (
	"context"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/orderlink-backend/application"
	"github.com/KaguraGateway/logosone/orderlink-backend/domain/model/order"
	orderitem "github.com/KaguraGateway/logosone/orderlink-backend/domain/model/order_item"
	"github.com/KaguraGateway/logosone/orderlink-backend/domain/repository"
	"github.com/KaguraGateway/logosone/orderlink-backend/infra/bundb/dao"
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
	}), synchro.In[tz.UTC](daoOrder.OrderAt), order.OrderType(daoOrder.OrderType), order.OrderStatus(daoOrder.Status), daoOrder.SeatName)
}

func toDaoOrder(order *order.Order) *dao.Order {
	return &dao.Order{
		Id:        order.Id(),
		OrderAt:   order.OrderAt().StdTime(),
		OrderType: uint(order.OrderType()),
		Status:    uint(order.Status()),
		SeatName:  order.SeatName(),
	}
}

func (r *orderRepositoryDb) Exists(ctx context.Context, id string) (bool, error) {
	return r.db.NewSelect().Model((*dao.Order)(nil)).Where("id = ?", id).Exists(ctx)
}

func (r *orderRepositoryDb) FindById(ctx context.Context, id string) (*order.Order, error) {
	daoOrder := new(dao.Order)
	if err := r.db.NewSelect().Model(daoOrder).Relation("OrderItems").Where("id = ?", id).Scan(ctx); err != nil {
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
	bunTx := tx.(bun.Tx)
	daoOrder := toDaoOrder(order)
	if _, err := orderSaveQuery(bunTx.NewInsert().Model(daoOrder)).Exec(ctx); err != nil {
		return err
	}
	return nil
}

type orderQueryServiceDb struct {
	db *bun.DB
}

func NewOrderQueryServiceDb(i *do.Injector) (application.OrderQueryService, error) {
	return &orderQueryServiceDb{
		db: do.MustInvoke[*bun.DB](i),
	}, nil
}

func toOrderDto(daoOrder dao.Order) *application.OrderDto {
	return &application.OrderDto{
		Id:         daoOrder.Id,
		OrderAt:    synchro.In[tz.UTC](daoOrder.OrderAt),
		OrderType:  order.OrderType(daoOrder.OrderType),
		TicketAddr: daoOrder.Ticket.TicketAddr,
		Status:     order.OrderStatus(daoOrder.Status),
		SeatName:   daoOrder.SeatName,
		OrderItems: lo.Map(daoOrder.OrderItems, func(orderItem *dao.OrderItem, _ int) orderitem.OrderItem {
			return *toDomainOrderItem(orderItem)
		}),
	}
}

func (s *orderQueryServiceDb) FindAllByStatus(ctx context.Context, status order.OrderStatus) ([]*application.OrderDto, error) {
	daoOrder := make([]dao.Order, 0)
	if err := s.db.NewSelect().Model(&daoOrder).Column("order.*").Relation("Ticket").Relation("OrderItems").Where("status = ?", status).Scan(ctx); err != nil {
		return nil, err
	}
	return lo.Map(daoOrder, func(order dao.Order, _ int) *application.OrderDto {
		return toOrderDto(order)
	}), nil
}

func (s *orderQueryServiceDb) FindAllNotProvided(ctx context.Context) ([]*application.OrderDto, error) {
	daoOrder := make([]dao.Order, 0)
	if err := s.db.NewSelect().Model(&daoOrder).Column("order.*").Relation("Ticket").Relation("OrderItems").Where("status != ?", order.Provided).Scan(ctx); err != nil {
		return nil, err
	}
	return lo.Map(daoOrder, func(order dao.Order, _ int) *application.OrderDto {
		return toOrderDto(order)
	}), nil
}
