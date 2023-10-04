package grpc_server

import (
	"connectrpc.com/connect"
	"context"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
	"github.com/KaguraGateway/cafelogos-pos-backend/application"
	"github.com/samber/do"
)

func (s *GrpcServer) GetOrderBySeatId(ctx context.Context, req *connect.Request[pos.GetOrderBySeatIdRequest]) (*connect.Response[pos.GetOrderResponse], error) {
	usecase := do.MustInvoke[application.GetOrderBySeatId](s.i)
	order, err := usecase.Execute(ctx, req.Msg.SeatId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&pos.GetOrderResponse{
		Order: ToProtoOrder(order),
	}), nil
}
