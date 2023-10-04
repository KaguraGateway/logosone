package repository

import (
	"context"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
)

type OrderItemRepository interface {
	SaveTx(ctx context.Context, tx interface{}, orderItem *model.OrderItem) error
}
