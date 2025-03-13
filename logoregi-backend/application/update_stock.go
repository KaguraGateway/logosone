package application

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/samber/do"
)

type UpdateStockParam struct {
	Id       string
	Name     string
	Quantity int32
}

type UpdateStock interface {
	Execute(ctx context.Context, param *UpdateStockParam) error
}

type updateStockUseCase struct {
	stockRepo repository.StockRepository
}

func NewUpdateStockUseCase(i *do.Injector) (UpdateStock, error) {
	return &updateStockUseCase{
		stockRepo: do.MustInvoke[repository.StockRepository](i),
	}, nil
}

func (uc *updateStockUseCase) Execute(ctx context.Context, param *UpdateStockParam) error {
	cctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	stock, err := uc.stockRepo.FindById(cctx, param.Id)
	if err != nil {
		return err
	}

	if err := stock.SetName(param.Name); err != nil {
		return err
	}
	stock.Quantity = param.Quantity

	if err := uc.stockRepo.Save(cctx, stock); err != nil {
		return err
	}
	return nil
}
