package application

import (
	"context"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/samber/do"
)

type GetExternalPayment interface {
	Execute(ctx context.Context, paymentId string) (*model.PaymentExternal, error)
}

type getExternalPaymentUseCase struct {
	paymentExternalRepo repository.PaymentExternalRepository
}

func NewGetExternalPaymentUseCase(i *do.Injector) (GetExternalPayment, error) {
	return &getExternalPaymentUseCase{
		paymentExternalRepo: do.MustInvoke[repository.PaymentExternalRepository](i),
	}, nil
}

func (g getExternalPaymentUseCase) Execute(ctx context.Context, paymentId string) (*model.PaymentExternal, error) {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	paymentExternal, err := g.paymentExternalRepo.FindByPaymentId(ctx, paymentId)
	if err != nil {
		return nil, err
	}

	return paymentExternal, nil
}
