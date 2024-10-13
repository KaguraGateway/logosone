package repository

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
)

type CoffeeBeanRepository interface {
	FindAll(ctx context.Context) ([]*model.CoffeeBean, error)
	FindById(ctx context.Context, id string) (*model.CoffeeBean, error)
	Save(ctx context.Context, coffeeBean *model.CoffeeBean) error
}
