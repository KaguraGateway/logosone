package repository

import (
	"context"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
)

type OrderRepository interface {
	Save(ctx context.Context, order *model.Order) error
}