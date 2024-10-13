package application

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/samber/do"
)

type PostProductCategoryParam struct {
	Name string
}

type PostProductCategory interface {
	Execute(ctx context.Context, param PostProductCategoryParam) error
}

type postProductCategoryUseCase struct {
	productCategoryRepo repository.ProductCategoryRepository
}

func NewPostProductCategoryUseCase(i *do.Injector) (PostProductCategory, error) {
	return &postProductCategoryUseCase{
		productCategoryRepo: do.MustInvoke[repository.ProductCategoryRepository](i),
	}, nil
}

func (uc *postProductCategoryUseCase) Execute(ctx context.Context, param PostProductCategoryParam) error {
	cctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	category, err := model.NewProductCategory(param.Name)
	if err != nil {
		return err
	}

	if err := uc.productCategoryRepo.Save(cctx, category); err != nil {
		return err
	}
	return nil
}
