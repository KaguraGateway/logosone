package application

import (
	"context"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/samber/do"
)

type GetProductCategories interface {
	Execute() ([]*model.ProductCategory, error)
}

type getProductCategoriesUseCase struct {
	ctx                 context.Context
	productCategoryRepo repository.ProductCategoryRepository
}

func NewGetProductCategoriesUseCase(i *do.Injector) *getProductCategoriesUseCase {
	return &getProductCategoriesUseCase{
		ctx:                 do.MustInvoke[context.Context](i),
		productCategoryRepo: do.MustInvoke[repository.ProductCategoryRepository](i),
	}
}

func (uc *getProductCategoriesUseCase) Execute() ([]*model.ProductCategory, error) {
	ctx, cancel := context.WithTimeout(uc.ctx, CtxTimeoutDur)
	defer cancel()
	return uc.productCategoryRepo.FindAll(ctx)
}
