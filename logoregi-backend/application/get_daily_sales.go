package application

import (
	"context"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
	"github.com/samber/do"
)

type GetDailySales struct {
	salesQueryService SalesQueryService
}

func NewGetDailySales(i *do.Injector) (*GetDailySales, error) {
	return &GetDailySales{
		salesQueryService: do.MustInvoke[SalesQueryService](i),
	}, nil
}

func (u *GetDailySales) Execute(ctx context.Context, startDate, endDate synchro.Time[tz.UTC]) ([]*pos.DailySale, error) {
	return u.salesQueryService.FindDailySales(ctx, startDate.StdTime(), endDate.StdTime())
}
