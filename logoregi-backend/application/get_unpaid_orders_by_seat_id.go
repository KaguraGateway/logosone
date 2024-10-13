package application

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/samber/do"
)

type GetUnpaidOrdersBySeatId interface {
	Execute(ctx context.Context, seatId string) ([]*model.Order, error)
}

type getUnpaidOrdersBySeatIdUseCase struct {
	orderQS OrderQueryService
}

func NewGetUnpaidOrdersBySeatIdUseCase(i *do.Injector) (GetUnpaidOrdersBySeatId, error) {
	return &getUnpaidOrdersBySeatIdUseCase{
		orderQS: do.MustInvoke[OrderQueryService](i),
	}, nil
}

func (uc *getUnpaidOrdersBySeatIdUseCase) Execute(ctx context.Context, seatId string) ([]*model.Order, error) {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	orders, err := uc.orderQS.FindAllBySeatId(ctx, seatId)
	if err != nil {
		return nil, err
	}

	return orders, nil
}
