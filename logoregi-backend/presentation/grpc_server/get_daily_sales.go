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

func (s *GrpcServer) GetDailySales(ctx context.Context, req *connect.Request[pos.GetDailySalesRequest]) (*connect.Response[pos.GetDailySalesResponse], error) {
	usecase := do.MustInvoke[*application.GetDailySales](s.i)
	
	startDate, err := synchro.ParseISO[tz.UTC](req.Msg.StartDate)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}
	
	endDate, err := synchro.ParseISO[tz.UTC](req.Msg.EndDate)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}
	
	dailySales, err := usecase.Execute(ctx, startDate, endDate)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	
	return connect.NewResponse(&pos.GetDailySalesResponse{
		DailySales: lo.Map(dailySales, func(sale *dto.DailySaleDto, _ int) *pos.DailySale {
			return ToDailySaleProto(sale)
		}),
	}), nil
}
