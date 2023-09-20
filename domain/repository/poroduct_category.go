package repository

import (
	"context"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
)

type ProductCategoryRepository interface {
	FindById(ctx context.Context, id string) (*model.ProductCategory, error)
	SaveTx(ctx context.Context, tx model.Tx, productCategory *model.ProductCategory) error
}
