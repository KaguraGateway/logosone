package application

import (
	"context"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/samber/do"
)

type GetOrders interface {
	Execute(ctx context.Context) ([]*model.Order, error)
}

type getOrdersUseCase struct {
	orderQS OrderQueryService
}

func NewGetOrdersUseCase(i *do.Injector) (GetOrders, error) {
	return &getOrdersUseCase{
		orderQS: do.MustInvoke[OrderQueryService](i),
	}, nil
}

func (uc *getOrdersUseCase) Execute(ctx context.Context) ([]*model.Order, error) {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	orders, err := uc.orderQS.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	return orders, nil
}
