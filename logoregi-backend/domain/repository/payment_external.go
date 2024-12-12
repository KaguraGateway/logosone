package repository

import (
	"context"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
)

type PaymentExternalRepository interface {
	FindById(ctx context.Context, id string) (*model.PaymentExternal, error)
	FindByPaymentId(ctx context.Context, paymentId string) (*model.PaymentExternal, error)
	FindAllByStatuses(ctx context.Context, statuses []string) ([]*model.PaymentExternal, error)
	Save(ctx context.Context, paymentExternal *model.PaymentExternal) error
	SaveTx(ctx context.Context, tx interface{}, paymentExternal *model.PaymentExternal) error
}
