package grpc_server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/logosone/proto/pkg/pos"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/samber/do"
)

func (s *GrpcServer) RefundPayment(ctx context.Context, req *connect.Request[pos.RefundPaymentRequest]) (*connect.Response[pos.RefundPaymentResponse], error) {
	usecase := do.MustInvoke[application.RefundPayment](s.i)
	
	payment, err := usecase.Execute(ctx, req.Msg.PaymentId)
	if err != nil {
		switch err {
		case application.ErrPaymentNotFound:
			return nil, connect.NewError(connect.CodeNotFound, err)
		case application.ErrRefundNotAllowed:
			return nil, connect.NewError(connect.CodeInvalidArgument, err)
		case application.ErrDifferentDayRefund:
			return nil, connect.NewError(connect.CodeInvalidArgument, err)
		default:
			return nil, connect.NewError(connect.CodeInternal, err)
		}
	}
	
	status := pos.PaymentStatus_PENDING
	if payment.GetPaymentStatus() == model.PaymentStatusSuccess {
		status = pos.PaymentStatus_SUCCESS
	}
	
	return connect.NewResponse(&pos.RefundPaymentResponse{
		Status: status,
		Payment: ToProtoPayment(payment),
	}), nil
}
