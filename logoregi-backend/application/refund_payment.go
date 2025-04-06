package application

import (
	"context"
	"errors"
	"time"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/samber/do"
)

var (
	ErrPaymentNotFound     = errors.New("payment not found")
	ErrRefundNotAllowed    = errors.New("refund is not allowed for this payment")
	ErrDifferentDayRefund  = errors.New("refund is only allowed on the same day as payment")
)

type RefundPayment interface {
	Execute(ctx context.Context, paymentId string) (*model.Payment, error)
}

type refundPaymentUseCase struct {
	paymentRepo repository.PaymentRepository
	orderQS     OrderQueryService
	stockRepo   repository.StockRepository
}

func NewRefundPaymentUseCase(i *do.Injector) (RefundPayment, error) {
	return &refundPaymentUseCase{
		paymentRepo: do.MustInvoke[repository.PaymentRepository](i),
		orderQS:     do.MustInvoke[OrderQueryService](i),
		stockRepo:   do.MustInvoke[repository.StockRepository](i),
	}, nil
}

func (uc *refundPaymentUseCase) Execute(ctx context.Context, paymentId string) (*model.Payment, error) {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	originalPayment, err := uc.paymentRepo.FindById(ctx, paymentId)
	if err != nil {
		return nil, ErrPaymentNotFound
	}

	if originalPayment.GetPaymentType() == model.Refund {
		return nil, ErrRefundNotAllowed
	}

	jstLoc, _ := time.LoadLocation("Asia/Tokyo")
	originalPaymentJST := originalPayment.GetPaymentAt().StdTime().In(jstLoc)
	nowJST := time.Now().In(jstLoc)

	if originalPaymentJST.Year() != nowJST.Year() || 
	   originalPaymentJST.Month() != nowJST.Month() || 
	   originalPaymentJST.Day() != nowJST.Day() {
		return nil, ErrDifferentDayRefund
	}

	orders := make([]*model.Order, 0)
	for _, orderId := range originalPayment.GetOrderIds() {
		order, err := uc.orderQS.FindById(ctx, orderId)
		if err != nil {
			return nil, err
		}
		orders = append(orders, order)
	}

	for _, order := range orders {
		for _, item := range order.GetOrderItems() {
			product := item.GetProduct()
			if product.GetStockId() != "" {
				stock, err := uc.stockRepo.FindById(ctx, product.GetStockId())
				if err != nil {
					continue // 在庫が見つからない場合はスキップ
				}
				
				stock.IncreaseQuantity(item.GetQuantity())
				if err := uc.stockRepo.Save(ctx, stock); err != nil {
					return nil, err
				}
			}
		}
	}

	refundPayment := model.NewPayment(
		originalPayment.GetOrderIds(),
		model.Refund,
		-originalPayment.ReceiveAmount,
		-originalPayment.PaymentAmount,
	)

	refundPayment.originalPaymentId = originalPayment.GetId()

	if err := uc.paymentRepo.Save(ctx, refundPayment); err != nil {
		return nil, err
	}

	return refundPayment, nil
}
