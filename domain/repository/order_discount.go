package repository

import (
	"context"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
)

type OrderDiscountRepository interface {
	SaveTx(ctx context.Context, tx interface{}, orderDiscount *model.OrderDiscount) error
}
