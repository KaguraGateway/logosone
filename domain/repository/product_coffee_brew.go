package repository

import (
	"context"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
)

type ProductCoffeeBrewRepository interface {
	FindById(ctx context.Context, id string) (*model.ProductCoffeeBrew, error)
	Save(ctx context.Context, productCoffeeBrew *model.ProductCoffeeBrew) error
}
