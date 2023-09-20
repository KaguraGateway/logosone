package repository

import (
	"context"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
)

type OrderItemRepository interface {
	FindById(ctx context.Context, id string) (*model.OrderItem, error)
	SaveTx(ctx context.Context, tx model.Tx, orderItem *model.OrderItem) error
}
