package repository

import (
	"context"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
)

type OrderRepository interface {
	FindById(ctx context.Context, id string) (*model.Order, error)
	SaveTx(ctx context.Context, tx model.Tx, order *model.Order) error
}
