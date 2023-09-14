package application

import (
	"context"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
)

type ProductQueryService interface {
	FindAll(ctx context.Context) ([]*model.Product, error)
	FindById(ctx context.Context, id string) (*model.Product, error)
}
