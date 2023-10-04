package repository

import (
	"context"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
)

type DiscountRepository interface {
	FindAll(ctx context.Context) ([]*model.Discount, error)
	FindById(ctx context.Context, id string) (*model.Discount, error)
	Save(ctx context.Context, discount *model.Discount) error
}
