package repository

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
)

type PaymentRepository interface {
	FindById(ctx context.Context, id string) (*model.Payment, error)
	Save(ctx context.Context, payment *model.Payment) error
	SaveTx(ctx context.Context, tx interface{}, payment *model.Payment) error
}
