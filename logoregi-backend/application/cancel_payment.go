package application

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/samber/do"
)

type CancelPayment interface {
	Execute(ctx context.Context, paymentId string) error
}

type cancelPaymentUseCase struct {
	paymentRepo repository.PaymentRepository
}

func NewCancelPaymentUseCase(i *do.Injector) (CancelPayment, error) {
	return &cancelPaymentUseCase{
		paymentRepo: do.MustInvoke[repository.PaymentRepository](i),
	}, nil
}

// Execute 決済を取消済みにする。注文データは監査のため削除せず残し、売上集計からのみ除外される
func (uc *cancelPaymentUseCase) Execute(ctx context.Context, paymentId string) error {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	if len(paymentId) == 0 {
		return ErrInvalidParam
	}

	payment, err := uc.paymentRepo.FindById(ctx, paymentId)
	if err != nil {
		return err
	}
	if err := payment.Cancel(); err != nil {
		return err
	}

	return uc.paymentRepo.Cancel(ctx, payment)
}
