package repository

import (
	"context"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
)

type OrderRepository interface {
	SaveTx(ctx context.Context, tx interface{}, order *model.Order) error
	Delete(ctx context.Context, id string) error
}
