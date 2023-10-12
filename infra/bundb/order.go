package bundb

import (
	"context"
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/cafelogos-pos-backend/application"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/KaguraGateway/cafelogos-pos-backend/infra/bundb/dao"
	"github.com/samber/do"
	"github.com/samber/lo"
	"github.com/uptrace/bun"
)

type orderDb struct {
	db *bun.DB
}

func NewOrderDb(i *do.Injector) (repository.OrderRepository, error) {
	return &orderDb{db: do.MustInvoke[*bun.DB](i)}, nil
}

func (i *orderDb) SaveTx(ctx context.Context, tx interface{}, order *model.Order) error {
	bunTx := tx.(bun.Tx)
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

type orderQueryServiceDb struct {
	db *bun.DB
}

func NewOrderQueryServiceDb(i *do.Injector) (application.OrderQueryService, error) {
	return &orderQueryServiceDb{db: do.MustInvoke[*bun.DB](i)}, nil
}

func toOrderItem(daoOrderItem *dao.OrderItem) *model.OrderItem {
	var coffeeBrew model.ProductCoffeeBrew
	if daoOrderItem.CoffeeBrew != nil {
		coffeeBrew = *toProductCoffeeBrew(*daoOrderItem.CoffeeBrew)
	}
	return model.ReconstructOrderItem(
		*toProduct(daoOrderItem.Product),
		daoOrderItem.Quantity,
		coffeeBrew,
	)
}

func toOrderDiscount(discount dao.OrderDiscount) *model.Discount {
	return model.ReconstructDiscount(
		discount.DiscountID,
		discount.Discount.Name,
		model.DiscountType(discount.Discount.DiscountType),
		discount.Discount.DiscountPrice,
	)
}

func toOrder(daoOrder *dao.Order) *model.Order {
	return model.ReconstructOrder(
		daoOrder.ID,
		lo.Map(daoOrder.OrderItems, func(daoOrderItem *dao.OrderItem, _ int) model.OrderItem {
			return *toOrderItem(daoOrderItem)
		}),
		lo.Map(daoOrder.OrderDiscounts, func(discount *dao.OrderDiscount, _ int) model.Discount {
			return *toOrderDiscount(*discount)
		}),
		model.OrderType(daoOrder.OrderType),
		toOrderPayment(daoOrder.OrderPayment),
		synchro.In[tz.UTC](daoOrder.OrderAt),
		daoOrder.ClientID,
		daoOrder.SeatID,
	)
}

func orderRelationQuery(q *bun.SelectQuery) *bun.SelectQuery {
	return q.
		Relation("OrderItems").
		Relation("OrderItems.Product").
		Relation("OrderItems.Product.Category").
		Relation("OrderItems.Product.CoffeeBean").
		Relation("OrderItems.Product.CoffeeBrews").
		Relation("OrderItems.Product.Stock").
		Relation("OrderDiscounts").
		Relation("OrderDiscounts.Discount").
		Relation("OrderPayment")
}

func (i *orderQueryServiceDb) FindAll(ctx context.Context) ([]*model.Order, error) {
	daoOrders := make([]dao.Order, 0)
	if err := orderRelationQuery(i.db.NewSelect().Model(&daoOrders).Column("order.*")).Order("id ASC").Scan(ctx); err != nil {
		return nil, err
	}
	return lo.Map(daoOrders, func(daoOrder dao.Order, _ int) *model.Order {
		return toOrder(&daoOrder)
	}), nil
}

func (i *orderQueryServiceDb) FindById(ctx context.Context, id string) (*model.Order, error) {
	daoOrder := new(dao.Order)
	if err := orderRelationQuery(i.db.NewSelect().Model(daoOrder).Column("order.*")).Where("order.id = ?", id).Scan(ctx); err != nil {
		return nil, err
	}
	return toOrder(daoOrder), nil
}

func (i *orderQueryServiceDb) FindBySeatId(ctx context.Context, seatId string) (*model.Order, error) {
	daoOrder := new(dao.Order)
	if err := orderRelationQuery(i.db.NewSelect().Model(daoOrder).Column("order.*")).Where("order.seat_id = ?", seatId).Scan(ctx); err != nil {
		return nil, err
	}
	return toOrder(daoOrder), nil
}
