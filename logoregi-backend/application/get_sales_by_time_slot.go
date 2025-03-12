package application

import (
	"context"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
	"github.com/samber/do"
)

type GetSalesByTimeSlot struct {
	salesQueryService SalesQueryService
}

func NewGetSalesByTimeSlot(i *do.Injector) (*GetSalesByTimeSlot, error) {
	return &GetSalesByTimeSlot{
		salesQueryService: do.MustInvoke[SalesQueryService](i),
	}, nil
}

func (u *GetSalesByTimeSlot) Execute(ctx context.Context, date synchro.Time[tz.UTC]) ([]*pos.TimeSlotSale, error) {
	return u.salesQueryService.FindSalesByTimeSlot(ctx, date.StdTime())
}
