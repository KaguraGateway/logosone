package application

import (
	"context"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/samber/do"
)

type PostProductCategoryParam struct {
	Name string
}

type PostProductCategory interface {
	Execute(param PostProductCategoryParam) error
}

type postProductCategoryUseCase struct {
	ctx                 context.Context
	productCategoryRepo repository.ProductCategoryRepository
}

func NewPostProductCategoryUseCase(i *do.Injector) *postProductCategoryUseCase {
	return &postProductCategoryUseCase{
		ctx:                 do.MustInvoke[context.Context](i),
		productCategoryRepo: do.MustInvoke[repository.ProductCategoryRepository](i),
	}
}

func (uc *postProductCategoryUseCase) Execute(param PostProductCategoryParam) error {
	ctx, cancel := context.WithTimeout(uc.ctx, CtxTimeoutDur)
	defer cancel()

	category, err := model.NewProductCategory(param.Name)
	if err != nil {
		return err
	}

	if err := uc.productCategoryRepo.Save(ctx, category); err != nil {
		return err
	}
	return nil
}
