package grpc_server

import (
	"connectrpc.com/connect"
	"context"
	"github.com/KaguraGateway/logosone/proto/pkg/pos"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/samber/do"
)

func (s *GrpcServer) GetExternalPayment(ctx context.Context, req *connect.Request[pos.GetExternalPaymentRequest]) (*connect.Response[pos.GetExternalPaymentResponse], error) {
	useCase := do.MustInvoke[application.GetExternalPayment](s.i)
	payment, err := useCase.Execute(ctx, req.Msg.PaymentId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&pos.GetExternalPaymentResponse{
		ExternalPayment: ToProtoPaymentExternal(payment),
	}), nil
}
