package repository

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
)

type OrderDiscountRepository interface {
	SaveTx(ctx context.Context, tx interface{}, orderDiscount *model.OrderDiscount) error
}
