package application

import (
	"context"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/logoregi-backend/application/dto"
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

func (u *GetSalesByTimeSlot) Execute(ctx context.Context, date synchro.Time[tz.UTC]) ([]*dto.TimeSlotSaleDto, error) {
	return u.salesQueryService.FindSalesByTimeSlot(ctx, date.StdTime())
}
