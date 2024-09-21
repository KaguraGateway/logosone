package repository

import (
	"context"

	orderitem "github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model/order_item"
)

type OrderItemRepository interface {
	FindById(ctx context.Context, id string) (*orderitem.OrderItem, error)
	Save(ctx context.Context, orderItem *orderitem.OrderItem) error
	SaveTx(ctx context.Context, tx interface{}, orderItem *orderitem.OrderItem) error
}
