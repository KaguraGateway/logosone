package grpc_server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/KaguraGateway/logosone/logoregi-backend/application/dto"
	"github.com/samber/do"
	"github.com/samber/lo"
)

func (s *GrpcServer) GetSalesByPaymentType(ctx context.Context, req *connect.Request[pos.GetSalesByPaymentTypeRequest]) (*connect.Response[pos.GetSalesByPaymentTypeResponse], error) {
	usecase := do.MustInvoke[*application.GetSalesByPaymentType](s.i)
	
	startDate, err := synchro.ParseISO[tz.UTC](req.Msg.StartDate)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}
	
	endDate, err := synchro.ParseISO[tz.UTC](req.Msg.EndDate)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}
	
	paymentTypeSales, err := usecase.Execute(ctx, startDate, endDate)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	
	return connect.NewResponse(&pos.GetSalesByPaymentTypeResponse{
		PaymentTypeSales: lo.Map(paymentTypeSales, func(sale *dto.PaymentTypeSaleDto, _ int) *pos.PaymentTypeSale {
			return ToPaymentTypeSaleProto(sale)
		}),
	}), nil
}
