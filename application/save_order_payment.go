package application

import (
	"context"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/cockroachdb/errors"
	"github.com/samber/do"
)

type SaveOrderPayment interface {
	Execute(ctx context.Context, orderId string, param OrderPaymentParam) (*model.OrderPayment, error)
}

type saveOrderPaymentUseCase struct {
	orderQS          OrderQueryService
	orderPaymentRepo repository.OrderPaymentRepository
}

func NewSaveOrderPaymentUseCase(i *do.Injector) (SaveOrderPayment, error) {
	return &saveOrderPaymentUseCase{
		orderQS:          do.MustInvoke[OrderQueryService](i),
		orderPaymentRepo: do.MustInvoke[repository.OrderPaymentRepository](i),
	}, nil
}

func (uc *saveOrderPaymentUseCase) Execute(ctx context.Context, orderId string, param OrderPaymentParam) (*model.OrderPayment, error) {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	// 注文チェック
	order, err := uc.orderQS.FindById(ctx, orderId)
	if err != nil {
		return nil, errors.Join(err, ErrOrderNotFound)
	}

	orderPayment := model.ReconstructOrderPayment(param.Id, orderId, param.PaymentType, param.ReceiveAmount, param.PaymentAmount, param.PaymentAt, param.UpdatedAt)
	// 支払いチェック
	if err := order.Pay(*orderPayment); err != nil {
		return nil, err
	}

	if err := uc.orderPaymentRepo.Save(ctx, orderPayment); err != nil {
		return nil, err
	}

	return orderPayment, nil
}
