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
	Execute(ctx context.Context, param *PostCoffeeBeanParam) error
}

type postCoffeeBeanUseCase struct {
	coffeeBeanRepo repository.CoffeeBeanRepository
}

func NewPostCoffeeBeanUseCase(i *do.Injector) (PostCoffeeBean, error) {
	return &postCoffeeBeanUseCase{
		coffeeBeanRepo: do.MustInvoke[repository.CoffeeBeanRepository](i),
	}, nil
}

func (uc *postCoffeeBeanUseCase) Execute(ctx context.Context, param *PostCoffeeBeanParam) error {
	cctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	coffeeBean, err := model.NewCoffeeBean(param.Name, param.GramQuantity)
	if err != nil {
		return err
	}

	if err := uc.coffeeBeanRepo.Save(cctx, coffeeBean); err != nil {
		return err
	}
	return nil
}
