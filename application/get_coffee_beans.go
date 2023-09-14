package application

import (
	"context"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/samber/do"
)

type GetCoffeeBeans interface {
	Execute() ([]*model.CoffeeBean, error)
}

type getCoffeeBeansUseCase struct {
	ctx            context.Context
	coffeeBeanRepo repository.CoffeeBeanRepository
}

func NewGetCoffeeBeansUseCase(i *do.Injector) *getCoffeeBeansUseCase {
	return &getCoffeeBeansUseCase{
		ctx:            do.MustInvoke[context.Context](i),
		coffeeBeanRepo: do.MustInvoke[repository.CoffeeBeanRepository](i),
	}
}

func (uc *getCoffeeBeansUseCase) Execute() ([]*model.CoffeeBean, error) {
	ctx, cancel := context.WithTimeout(uc.ctx, CtxTimeoutDur)
	defer cancel()
	return uc.coffeeBeanRepo.FindAll(ctx)
}
