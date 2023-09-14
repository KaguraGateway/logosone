package application

import (
	"context"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/samber/do"
)

type PostCoffeeBeanParam struct {
	Name         string
	GramQuantity int
}

type PostCoffeeBean interface {
	Execute(param *PostCoffeeBeanParam) error
}

type postCoffeeBeanUseCase struct {
	ctx            context.Context
	coffeeBeanRepo repository.CoffeeBeanRepository
}

func NewPostCoffeeBeanUseCase(i *do.Injector) *postCoffeeBeanUseCase {
	return &postCoffeeBeanUseCase{
		ctx:            do.MustInvoke[context.Context](i),
		coffeeBeanRepo: do.MustInvoke[repository.CoffeeBeanRepository](i),
	}
}

func (uc *postCoffeeBeanUseCase) Execute(param *PostCoffeeBeanParam) error {
	ctx, cancel := context.WithTimeout(uc.ctx, CtxTimeoutDur)
	defer cancel()

	coffeeBean, err := model.NewCoffeeBean(param.Name, param.GramQuantity)
	if err != nil {
		return err
	}

	if err := uc.coffeeBeanRepo.Save(ctx, coffeeBean); err != nil {
		return err
	}
	return nil
}
