package repository

import (
	"context"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
)

type StockRepository interface {
	FindAll(ctx context.Context) ([]*model.Stock, error)
	FindById(ctx context.Context, id string) (*model.Stock, error)
	Save(ctx context.Context, stock *model.Stock) error
}
