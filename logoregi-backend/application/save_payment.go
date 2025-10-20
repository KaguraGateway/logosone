package application

import (
	"context"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/domain_service"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/samber/do"
)

type SavePayment interface {
	Execute(ctx context.Context, param PaymentParam) (*model.Payment, []*model.OrderTicket, error)
}

type savePaymentUseCase struct {
	orderQS                OrderQueryService
	paymentRepo            repository.PaymentRepository
	paymentExternalService PaymentExternalService
	postOrderUseCase       PostOrder
}

func NewSavePaymentUseCase(i *do.Injector) (SavePayment, error) {
	return &savePaymentUseCase{
		orderQS:                do.MustInvoke[OrderQueryService](i),
		paymentRepo:            do.MustInvoke[repository.PaymentRepository](i),
		paymentExternalService: do.MustInvoke[PaymentExternalService](i),
		postOrderUseCase:       do.MustInvoke[PostOrder](i),
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
			// FIXME: Hack実装
			if param.PaymentType == model.External {
				// NOTE: 外部決済の場合、まだこの時点では決済完了していないので、決済完了時点でOrderLinkに通知するためにIsPostOrderLinkをfalseにする
				orderParam.IsPostOrderLink = false
			}
			// FIXME: こんなところで呼び出してるからなんらかで決済失敗してもOrderLinkにオーダーが流れる問題が
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
	// NOTE: 外部決済以外はチェック
	if payment.GetPaymentType() != model.External && !domain_service.IsEnoughAmount(payment, orders) {
		return nil, nil, ErrPaymentNotEnough
	}
	if payment.GetPaymentType() != model.External && param.ChangeAmount != payment.GetChangeAmount() {
		return nil, nil, ErrPaymentChangeAmountDiff
	}
	if param.PaymentAmount != domain_service.GetTotalAmount(orders) {
		return nil, nil, ErrPaymentAmountDiff
	}

	if err := uc.paymentRepo.Save(ctx, payment); err != nil {
		return nil, nil, err
	}

	// 外部決済
	if payment.GetPaymentType() == model.External {
		paymentExternal := model.NewPaymentExternal(payment.GetId(), param.PaymentExternalParam.PaymentType, param.PaymentExternalParam.ExternalDeviceId)
		if err := uc.paymentExternalService.Create(ctx, payment, paymentExternal); err != nil {
			return nil, nil, err
		}
	}

	return payment, postOrderTickets, nil
}
