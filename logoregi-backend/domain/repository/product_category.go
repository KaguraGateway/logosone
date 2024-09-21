package repository

import (
	"context"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
)

type ProductCategoryRepository interface {
	FindAll(ctx context.Context) ([]*model.ProductCategory, error)
	FindById(ctx context.Context, id string) (*model.ProductCategory, error)
	Save(ctx context.Context, productCategory *model.ProductCategory) error
}
