package repository

import (
	"context"

	cookingtime "github.com/KaguraGateway/logosone/orderlink-backend/domain/model/cooking_time"
)

type CookingTimeRepository interface {
	FindByProductId(ctx context.Context, productId string) (*cookingtime.CookingTime, error)
	FindAll(ctx context.Context) ([]*cookingtime.CookingTime, error)
	Save(ctx context.Context, cookingTime *cookingtime.CookingTime) error
	SaveTx(ctx context.Context, tx interface{}, cookingTime *cookingtime.CookingTime) error
}
