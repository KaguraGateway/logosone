package application

import (
	"context"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/samber/do"
)

type GetProducts interface {
	Execute() ([]*model.Product, error)
}

type getProductsUseCase struct {
	ctx                 context.Context
	productQueryService ProductQueryService
}

func NewGetProductsUseCase(i *do.Injector) *getProductsUseCase {
	return &getProductsUseCase{
		ctx:                 do.MustInvoke[context.Context](i),
		productQueryService: do.MustInvoke[ProductQueryService](i),
	}
}

func (uc *getProductsUseCase) Execute() ([]*model.Product, error) {
	ctx, cancel := context.WithTimeout(uc.ctx, CtxTimeoutDur)
	defer cancel()
	return uc.productQueryService.FindAll(ctx)
}
