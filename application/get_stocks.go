package application

import (
	"context"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/samber/do"
)

type GetStocks interface {
	Execute(ctx context.Context) ([]*model.Stock, error)
}

type getStocksUseCase struct {
	stockRepo repository.StockRepository
}

func NewGetStocksUseCase(i *do.Injector) (GetStocks, error) {
	return &getStocksUseCase{
		stockRepo: do.MustInvoke[repository.StockRepository](i),
	}, nil
}

func (uc *getStocksUseCase) Execute(ctx context.Context) ([]*model.Stock, error) {
	cctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()
	return uc.stockRepo.FindAll(cctx)
}
