package repository

import (
	"context"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model/order"
)

type OrderRepository interface {
	FindById(ctx context.Context, id string) (*order.Order, error)
	Save(ctx context.Context, order *order.Order) error
	SaveTx(ctx context.Context, tx model.Tx, order *order.Order) error
}
