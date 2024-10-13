package repository

import (
	"context"

	"github.com/KaguraGateway/logosone/orderlink-backend/domain/model/order"
)

type OrderRepository interface {
	Exists(ctx context.Context, id string) (bool, error)
	FindById(ctx context.Context, id string) (*order.Order, error)
	Save(ctx context.Context, order *order.Order) error
	SaveTx(ctx context.Context, tx interface{}, order *order.Order) error
}
