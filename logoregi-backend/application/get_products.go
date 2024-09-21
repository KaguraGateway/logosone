package application

import (
	"context"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/samber/do"
)

type GetProducts interface {
	Execute(ctx context.Context) ([]*model.Product, error)
}

type getProductsUseCase struct {
	productQueryService ProductQueryService
}

func NewGetProductsUseCase(i *do.Injector) (GetProducts, error) {
	return &getProductsUseCase{
		productQueryService: do.MustInvoke[ProductQueryService](i),
	}, nil
}

func (uc *getProductsUseCase) Execute(ctx context.Context) ([]*model.Product, error) {
	cctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()
	return uc.productQueryService.FindAll(cctx)
}
