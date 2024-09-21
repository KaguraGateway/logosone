package application

import (
	"context"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/samber/do"
)

type GetCoffeeBeans interface {
	Execute(ctx context.Context) ([]*model.CoffeeBean, error)
}

type getCoffeeBeansUseCase struct {
	coffeeBeanRepo repository.CoffeeBeanRepository
}

func NewGetCoffeeBeansUseCase(i *do.Injector) (GetCoffeeBeans, error) {
	return &getCoffeeBeansUseCase{
		coffeeBeanRepo: do.MustInvoke[repository.CoffeeBeanRepository](i),
	}, nil
}

func (uc *getCoffeeBeansUseCase) Execute(ctx context.Context) ([]*model.CoffeeBean, error) {
	cctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()
	return uc.coffeeBeanRepo.FindAll(cctx)
}
