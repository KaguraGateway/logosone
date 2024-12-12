package application

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
)

type ProductQueryService interface {
	FindAll(ctx context.Context) ([]*model.Product, error)
	FindById(ctx context.Context, id string) (*model.Product, error)
}

type OrderQueryService interface {
	FindAll(ctx context.Context) ([]*model.Order, error)
	FindById(ctx context.Context, id string) (*model.Order, error)
	FindAllBySeatId(ctx context.Context, seatId string) ([]*model.Order, error)
	FindByPaymentId(ctx context.Context, paymentId string) (*model.Order, error)
}

type PaymentExternalService interface {
	Create(ctx context.Context, payment *model.Payment, paymentExternal *model.PaymentExternal) error
	UpdateByExternalId(ctx context.Context, externalId string) (*model.PaymentExternal, error)
	Polling(ctx context.Context) error
}
