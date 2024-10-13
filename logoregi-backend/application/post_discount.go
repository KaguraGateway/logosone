package application

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/samber/do"
)

type PostDiscountParam struct {
	Name          string
	DiscountType  model.DiscountType
	DiscountPrice uint64
}

type PostDiscount interface {
	Execute(ctx context.Context, param PostDiscountParam) error
}

type postDiscountUseCase struct {
	discountRepo repository.DiscountRepository
}

func NewPostDiscountUseCase(i *do.Injector) (PostDiscount, error) {
	return &postDiscountUseCase{
		discountRepo: do.MustInvoke[repository.DiscountRepository](i),
	}, nil
}

func (uc *postDiscountUseCase) Execute(ctx context.Context, param PostDiscountParam) error {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	discount, err := model.NewDiscount(param.Name, param.DiscountType, param.DiscountPrice)
	if err != nil {
		return err
	}

	if err := uc.discountRepo.Save(ctx, discount); err != nil {
		return err
	}

	return nil
}
