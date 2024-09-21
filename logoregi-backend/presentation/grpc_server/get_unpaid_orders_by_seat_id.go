package grpc_server

import (
	"connectrpc.com/connect"
	"context"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
	"github.com/KaguraGateway/cafelogos-pos-backend/application"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/samber/do"
	"github.com/samber/lo"
)

func (s *GrpcServer) GetUnpaidOrdersBySeatId(ctx context.Context, req *connect.Request[pos.GetUnpaidOrdersBySeatIdRequest]) (*connect.Response[pos.GetOrdersResponse], error) {
	usecase := do.MustInvoke[application.GetUnpaidOrdersBySeatId](s.i)
	orders, err := usecase.Execute(ctx, req.Msg.SeatId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&pos.GetOrdersResponse{
		Orders: lo.Map(orders, func(order *model.Order, index int) *pos.Order {
			return ToProtoOrder(order)
		}),
	}), nil
}
