package repository

import (
	"context"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
)

type ProductCategoryRepository interface {
	FindById(ctx context.Context, id string) (*model.ProductCategory, error)
	Save(ctx context.Context, productCategory *model.ProductCategory) error
}
