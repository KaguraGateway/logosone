package application

import (
	"context"
	"fmt"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/samber/do"
)

type CancelOrder interface {
	Execute(ctx context.Context, orderId string) error
}

type cancelOrderUseCase struct {
	orderQS   OrderQueryService
	orderRepo repository.OrderRepository
	productQS ProductQueryService
	stockRepo repository.StockRepository
	txRepo    repository.TxRepository
}

func NewCancelOrderUseCase(i *do.Injector) (CancelOrder, error) {
	return &cancelOrderUseCase{
		orderQS:   do.MustInvoke[OrderQueryService](i),
		orderRepo: do.MustInvoke[repository.OrderRepository](i),
		productQS: do.MustInvoke[ProductQueryService](i),
		stockRepo: do.MustInvoke[repository.StockRepository](i),
		txRepo:    do.MustInvoke[repository.TxRepository](i),
	}, nil
}

func (uc *cancelOrderUseCase) Execute(ctx context.Context, orderId string) error {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	order, err := uc.orderQS.FindById(ctx, orderId)
	if err != nil {
		return fmt.Errorf("failed to find order: %w", err)
	}

	if order.GetStatus() == model.OrderStatusCanceled {
		return nil
	}

	err = uc.txRepo.Transaction(ctx, func(ctx context.Context, tx interface{}) error {
		var updateStocks []*model.Stock

		for _, item := range order.GetOrderItems() {
			product, err := uc.productQS.FindById(ctx, item.GetProductId())
			if err != nil {
				return err
			}
			if product.Stock != nil {
				product.Stock.Quantity += int32(item.Quantity)
				updateStocks = append(updateStocks, product.Stock)
			}
		}

		for _, stock := range updateStocks {
			if err := uc.stockRepo.SaveTx(ctx, tx, stock); err != nil {
				return err
			}
		}

		if err := uc.orderRepo.UpdateStatus(ctx, orderId, model.OrderStatusCanceled); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return fmt.Errorf("transaction failed: %w", err)
	}

	return nil
}
