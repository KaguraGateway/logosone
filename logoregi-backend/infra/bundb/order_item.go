package bundb

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/KaguraGateway/logosone/logoregi-backend/infra/bundb/dao"
	"github.com/samber/do"
	"github.com/uptrace/bun"
)

type orderItemDb struct {
	db *bun.DB
}

func NewOrderItemDb(i *do.Injector) (repository.OrderItemRepository, error) {
	return &orderItemDb{db: do.MustInvoke[*bun.DB](i)}, nil
}

func (i *orderItemDb) SaveTx(ctx context.Context, tx interface{}, orderId string, orderItem *model.OrderItem) error {
	bunTx := tx.(bun.Tx)
	coffeeBrewId := ""
	brew := orderItem.GetCoffeeHowToBrew()
	if &brew != nil {
		coffeeBrewId = brew.GetId()
	}

	daoOrderItem := &dao.OrderItem{
		OrderID:      orderId,
		ProductID:    orderItem.GetProductId(),
		Quantity:     orderItem.Quantity,
		Amount:       orderItem.GetProductAmount(),
		CoffeeBrewID: coffeeBrewId,
	}
	if _, err := bunTx.NewInsert().Model(daoOrderItem).Exec(ctx); err != nil {
		return err
	}
	return nil
}
