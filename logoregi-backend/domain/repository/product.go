package repository

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
)

type ProductRepository interface {
	Save(ctx context.Context, product *model.Product) error
	Delete(ctx context.Context, id string) error
}
