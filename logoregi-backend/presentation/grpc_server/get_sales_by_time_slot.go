package grpc_server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/proto/pkg/pos"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/KaguraGateway/logosone/logoregi-backend/application/dto"
	"github.com/samber/do"
	"github.com/samber/lo"
)

func (s *GrpcServer) GetSalesByTimeSlot(ctx context.Context, req *connect.Request[pos.GetSalesByTimeSlotRequest]) (*connect.Response[pos.GetSalesByTimeSlotResponse], error) {
	usecase := do.MustInvoke[*application.GetSalesByTimeSlot](s.i)
	
	date, err := synchro.ParseISO[tz.UTC](req.Msg.Date)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}
	
	timeSlotSales, err := usecase.Execute(ctx, date)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	
	return connect.NewResponse(&pos.GetSalesByTimeSlotResponse{
		TimeSlotSales: lo.Map(timeSlotSales, func(sale *dto.TimeSlotSaleDto, _ int) *pos.TimeSlotSale {
			return ToTimeSlotSaleProto(sale)
		}),
	}), nil
}
