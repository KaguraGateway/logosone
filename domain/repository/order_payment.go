package repository

import (
	"context"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
)

type OrderPaymentRepository interface {
	FindById(ctx context.Context, id string) (*model.OrderPayment, error)
	Save(ctx context.Context, orderPayment *model.OrderPayment) error
}
