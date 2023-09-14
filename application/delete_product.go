package application

import (
	"context"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/samber/do"
)

type DeleteProduct interface {
	Execute(id string) error
}

type deleteProductUseCase struct {
	ctx         context.Context
	productRepo repository.ProductRepository
}

func NewDeleteProductUseCase(i *do.Injector) *deleteProductUseCase {
	return &deleteProductUseCase{
		ctx:         do.MustInvoke[context.Context](i),
		productRepo: do.MustInvoke[repository.ProductRepository](i),
	}
}

func (uc *deleteProductUseCase) Execute(id string) error {
	ctx, cancel := context.WithTimeout(uc.ctx, CtxTimeoutDur)
	defer cancel()

	if err := uc.productRepo.Delete(ctx, id); err != nil {
		return err
	}
	return nil
}