package grpc_server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/samber/do"
)

func (s *GrpcServer) UpdatePayment(ctx context.Context, req *connect.Request[pos.UpdatePaymentRequest]) (*connect.Response[pos.PaymentResponse], error) {
	usecase := do.MustInvoke[application.SavePayment](s.i)
	param, err := ToPaymentParam(req.Msg.Payment)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	payment, _, err := usecase.Execute(ctx, *param)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&pos.PaymentResponse{
		IsOk:    true,
		Payment: ToProtoPayment(payment),
	}), nil
}
