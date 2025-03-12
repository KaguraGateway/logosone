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

func (s *GrpcServer) GetProductSales(ctx context.Context, req *connect.Request[pos.GetProductSalesRequest]) (*connect.Response[pos.GetProductSalesResponse], error) {
	usecase := do.MustInvoke[*application.GetProductSales](s.i)
	
	startDate, err := synchro.ParseISO[tz.UTC](req.Msg.StartDate)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}
	
	endDate, err := synchro.ParseISO[tz.UTC](req.Msg.EndDate)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}
	
	productSales, err := usecase.Execute(ctx, startDate, endDate)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	
	return connect.NewResponse(&pos.GetProductSalesResponse{
		ProductSales: lo.Map(productSales, func(sale *dto.ProductSaleDto, _ int) *pos.ProductSale {
			return ToProductSaleProto(sale)
		}),
	}), nil
}
