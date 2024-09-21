package grpc_server

import (
	"connectrpc.com/connect"
	"context"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
	"github.com/KaguraGateway/cafelogos-pos-backend/application"
	"github.com/samber/do"
)

func (s *GrpcServer) PostOrder(ctx context.Context, req *connect.Request[pos.PostOrderRequest]) (*connect.Response[pos.PostOrderResponse], error) {
	usecase := do.MustInvoke[application.PostOrder](s.i)

	param, err := ToOrderParam(req.Msg.Order)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	_, ticket, err := usecase.Execute(ctx, *param)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&pos.PostOrderResponse{
		CallNumber: ticket.GetTicketAddr(),
	}), nil
}
