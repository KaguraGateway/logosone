package application

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/samber/do"
)

type DeleteProduct interface {
	Execute(ctx context.Context, id string) error
}

type deleteProductUseCase struct {
	productRepo repository.ProductRepository
}

func NewDeleteProductUseCase(i *do.Injector) (DeleteProduct, error) {
	return &deleteProductUseCase{
		productRepo: do.MustInvoke[repository.ProductRepository](i),
	}, nil
}

func (uc *deleteProductUseCase) Execute(ctx context.Context, id string) error {
	cctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	if err := uc.productRepo.Delete(cctx, id); err != nil {
		return err
	}
	return nil
}
