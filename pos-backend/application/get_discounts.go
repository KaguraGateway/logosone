package application

import (
	"context"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/samber/do"
)

type GetDiscounts interface {
	Execute(ctx context.Context) ([]*model.Discount, error)
}

type getDiscountsUseCase struct {
	discountRepo repository.DiscountRepository
}

func NewGetDiscountsUseCase(i *do.Injector) (GetDiscounts, error) {
	return &getDiscountsUseCase{
		discountRepo: do.MustInvoke[repository.DiscountRepository](i),
	}, nil
}

func (uc *getDiscountsUseCase) Execute(ctx context.Context) ([]*model.Discount, error) {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	discounts, err := uc.discountRepo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	return discounts, nil
}
