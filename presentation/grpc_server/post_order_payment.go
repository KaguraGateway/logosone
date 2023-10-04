package grpc_server

import (
	"connectrpc.com/connect"
	"context"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
	"github.com/KaguraGateway/cafelogos-pos-backend/application"
	"github.com/samber/do"
)

func (s *GrpcServer) PostOrderPayment(ctx context.Context, req *connect.Request[pos.PostOrderPaymentRequest]) (*connect.Response[pos.OrderPaymentResponse], error) {
	usecase := do.MustInvoke[application.SaveOrderPayment](s.i)
	param, err := ToOrderPaymentParam(req.Msg.Payment)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	payment, err := usecase.Execute(ctx, req.Msg.OrderId, *param)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&pos.OrderPaymentResponse{
		IsOk:    true,
		Payment: ToProtoOrderPayment(payment),
	}), nil
}
