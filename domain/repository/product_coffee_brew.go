package repository

import (
	"context"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
)

type ProductCoffeeBrewRepository interface {
	FindById(ctx context.Context, id string) (*model.ProductCoffeeBrew, error)
	SaveTx(ctx context.Context, tx model.Tx, productCoffeeBrew *model.ProductCoffeeBrew) error
}
