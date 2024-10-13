package repository

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
)

type OrderItemRepository interface {
	SaveTx(ctx context.Context, tx interface{}, orderId string, orderItem *model.OrderItem) error
}
