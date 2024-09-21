package application

import (
	"context"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/samber/do"
)

type PostStockParam struct {
	Name     string
	Quantity int32
}

type PostStock interface {
	Execute(ctx context.Context, param *PostStockParam) error
}

type postStockUseCase struct {
	stockRepo repository.StockRepository
}

func NewPostStockUseCase(i *do.Injector) (PostStock, error) {
	return &postStockUseCase{
		stockRepo: do.MustInvoke[repository.StockRepository](i),
	}, nil
}

func (uc *postStockUseCase) Execute(ctx context.Context, param *PostStockParam) error {
	cctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	stock, err := model.NewStock(param.Name, param.Quantity)
	if err != nil {
		return err
	}

	if err := uc.stockRepo.Save(cctx, stock); err != nil {
		return err
	}
	return nil
}
