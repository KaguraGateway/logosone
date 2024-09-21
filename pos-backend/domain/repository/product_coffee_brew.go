package repository

import (
	"context"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
)

type ProductCoffeeBrewRepository interface {
	FindById(ctx context.Context, id string) (*model.ProductCoffeeBrew, error)
	FindAllByProductId(ctx context.Context, productId string) ([]*model.ProductCoffeeBrew, error)
	Save(ctx context.Context, productCoffeeBrew *model.ProductCoffeeBrew) error
	Delete(ctx context.Context, id string) error
}
