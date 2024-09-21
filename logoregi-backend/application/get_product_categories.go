package application

import (
	"context"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/samber/do"
)

type GetProductCategories interface {
	Execute(ctx context.Context) ([]*model.ProductCategory, error)
}

type getProductCategoriesUseCase struct {
	productCategoryRepo repository.ProductCategoryRepository
}

func NewGetProductCategoriesUseCase(i *do.Injector) (GetProductCategories, error) {
	return &getProductCategoriesUseCase{
		productCategoryRepo: do.MustInvoke[repository.ProductCategoryRepository](i),
	}, nil
}

func (uc *getProductCategoriesUseCase) Execute(ctx context.Context) ([]*model.ProductCategory, error) {
	cctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()
	return uc.productCategoryRepo.FindAll(cctx)
}
