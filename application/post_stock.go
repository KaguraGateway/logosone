package application

import (
	"context"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/samber/do"
)

type PostStockParam struct {
	Name string
	Quantity int32
}

type PostStock interface {
	Execute(param *PostStockParam) error
}

type postStockUseCase struct {
	ctx       context.Context
	stockRepo repository.StockRepository
}

func NewPostStockUseCase(i *do.Injector) *postStockUseCase {
	return &postStockUseCase{
		ctx:       do.MustInvoke[context.Context](i),
		stockRepo: do.MustInvoke[repository.StockRepository](i),
	}
}

func (uc *postStockUseCase) Execute(param *PostStockParam) error {
	ctx, cancel := context.WithTimeout(uc.ctx, CtxTimeoutDur)
	defer cancel()

	stock, err := model.NewStock(param.Name, param.Quantity)
	if err != nil {
		return err
	}

	if err := uc.stockRepo.Save(ctx, stock); err != nil {
		return err
	}
	return nil
}
