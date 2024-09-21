package application

import (
	"context"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/samber/do"
)

type DeleteOrder interface {
	Execute(ctx context.Context, id string) error
}

type deleteOrderUseCase struct {
	orderRepo repository.OrderRepository
}

func NewDeleteOrderUseCase(i *do.Injector) (DeleteOrder, error) {
	return &deleteOrderUseCase{
		orderRepo: do.MustInvoke[repository.OrderRepository](i),
	}, nil
}

func (uc *deleteOrderUseCase) Execute(ctx context.Context, id string) error {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	err := uc.orderRepo.Delete(ctx, id)
	if err != nil {
		return err
	}

	return nil
}
