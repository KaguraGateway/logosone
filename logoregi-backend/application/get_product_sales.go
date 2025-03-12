package application

import (
	"context"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/logoregi-backend/application/dto"
	"github.com/samber/do"
)

type GetProductSales struct {
	salesQueryService SalesQueryService
}

func NewGetProductSales(i *do.Injector) (*GetProductSales, error) {
	return &GetProductSales{
		salesQueryService: do.MustInvoke[SalesQueryService](i),
	}, nil
}

func (u *GetProductSales) Execute(ctx context.Context, startDate, endDate synchro.Time[tz.UTC]) ([]*dto.ProductSaleDto, error) {
	return u.salesQueryService.FindProductSales(ctx, startDate.StdTime(), endDate.StdTime())
}
