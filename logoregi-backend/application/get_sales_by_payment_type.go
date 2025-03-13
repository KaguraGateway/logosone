package application

import (
	"context"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/logoregi-backend/application/dto"
	"github.com/samber/do"
)

type GetSalesByPaymentType struct {
	salesQueryService SalesQueryService
}

func NewGetSalesByPaymentType(i *do.Injector) (*GetSalesByPaymentType, error) {
	return &GetSalesByPaymentType{
		salesQueryService: do.MustInvoke[SalesQueryService](i),
	}, nil
}

func (u *GetSalesByPaymentType) Execute(ctx context.Context, startDate, endDate synchro.Time[tz.UTC]) ([]*dto.PaymentTypeSaleDto, error) {
	return u.salesQueryService.FindSalesByPaymentType(ctx, startDate.StdTime(), endDate.StdTime())
}
