package application

import (
	"context"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/domain_service"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/samber/do"
)

type SavePayment interface {
	Execute(ctx context.Context, param PaymentParam) (*model.Payment, []*model.OrderTicket, error)
}

type savePaymentUseCase struct {
	orderQS          OrderQueryService
	paymentRepo      repository.PaymentRepository
	postOrderUseCase PostOrder
}

func NewSavePaymentUseCase(i *do.Injector) (SavePayment, error) {
	return &savePaymentUseCase{
		orderQS:          do.MustInvoke[OrderQueryService](i),
		paymentRepo:      do.MustInvoke[repository.PaymentRepository](i),
		postOrderUseCase: do.MustInvoke[PostOrder](i),
	}, nil
}

func (uc *savePaymentUseCase) Execute(ctx context.Context, param PaymentParam) (*model.Payment, []*model.OrderTicket, error) {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	if len(param.OrderIds) == 0 && len(param.PostOrders) == 0 {
		return nil, nil, ErrInvalidParam
	}

	var orderIds []string
	orders := make([]*model.Order, 0)
	var postOrderTickets []*model.OrderTicket
	if len(param.PostOrders) > 0 {
		orderIds = make([]string, 0)
		for _, orderParam := range param.PostOrders {
			order, orderTicket, err := uc.postOrderUseCase.Execute(ctx, orderParam)
			if err != nil {
				return nil, nil, err
			}
			orders = append(orders, order)
			postOrderTickets = append(postOrderTickets, orderTicket)
			orderIds = append(orderIds, order.GetId())
		}
	} else {
		orderIds = param.OrderIds
		for _, orderId := range orderIds {
			if order, err := uc.orderQS.FindById(ctx, orderId); err != nil {
				return nil, nil, err
			} else {
				orders = append(orders, order)
			}
		}
	}

	payment := model.ReconstructPayment(param.Id, orderIds, param.PaymentType, param.ReceiveAmount, param.PaymentAmount, param.PaymentAt, param.UpdatedAt)
	// 支払いチェック
	if !domain_service.IsEnoughAmount(payment, orders) {
		return nil, nil, ErrPaymentNotEnough
	}
	if param.PaymentAmount != domain_service.GetTotalAmount(orders) {
		return nil, nil, ErrPaymentAmountDiff
	}
	if param.ChangeAmount != payment.GetChangeAmount() {
		return nil, nil, ErrPaymentChangeAmountDiff
	}

	if err := uc.paymentRepo.Save(ctx, payment); err != nil {
		return nil, nil, err
	}

	return payment, postOrderTickets, nil
}
