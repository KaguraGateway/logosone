package application

import (
	"context"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/samber/do"
)

type GetStocks interface {
	Execute() ([]*model.Stock, error)
}

type getStocksUseCase struct {
	ctx       context.Context
	stockRepo repository.StockRepository
}

func NewGetStocksUseCase(i *do.Injector) *getStocksUseCase {
	return &getStocksUseCase{
		ctx:       do.MustInvoke[context.Context](i),
		stockRepo: do.MustInvoke[repository.StockRepository](i),
	}
}

func (uc *getStocksUseCase) Execute() ([]*model.Stock, error) {
	ctx, cancel := context.WithTimeout(uc.ctx, CtxTimeoutDur)
	defer cancel()
	return uc.stockRepo.FindAll(ctx)
}
