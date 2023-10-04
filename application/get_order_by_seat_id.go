package application

import (
	"context"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/samber/do"
)

type GetOrderBySeatId interface {
	Execute(ctx context.Context, seatId string) (*model.Order, error)
}

type getOrderBySeatIdUseCase struct {
	orderQS OrderQueryService
}

func NewGetOrderBySeatIdUseCase(i *do.Injector) (GetOrderBySeatId, error) {
	return &getOrderBySeatIdUseCase{
		orderQS: do.MustInvoke[OrderQueryService](i),
	}, nil
}

func (uc *getOrderBySeatIdUseCase) Execute(ctx context.Context, seatId string) (*model.Order, error) {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	order, err := uc.orderQS.FindBySeatId(ctx, seatId)
	if err != nil {
		return nil, err
	}

	return order, nil
}
