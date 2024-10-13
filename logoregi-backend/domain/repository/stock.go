package repository

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
)

type StockRepository interface {
	FindAll(ctx context.Context) ([]*model.Stock, error)
	FindById(ctx context.Context, id string) (*model.Stock, error)
	Save(ctx context.Context, stock *model.Stock) error
	SaveTx(ctx context.Context, tx interface{}, stock *model.Stock) error
}
