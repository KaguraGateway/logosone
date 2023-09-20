package repository

import (
	"context"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model/order"
)

type OrderRepository interface {
	FindById(ctx context.Context, id string) (*order.Order, error)
	Save(ctx context.Context, order *order.Order) error
	SaveTx(ctx context.Context, tx interface{}, order *order.Order) error
}
