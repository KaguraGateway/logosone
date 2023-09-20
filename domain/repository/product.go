package repository

import (
	"context"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
)

type ProductRepository interface {
	FindById(ctx context.Context, id string) (*model.Product, error)
	Save(ctx context.Context, product *model.Product) error
}
