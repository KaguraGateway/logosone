package grpc_server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/samber/do"
	"github.com/samber/lo"
)

func (s *GrpcServer) PostPayment(ctx context.Context, req *connect.Request[pos.PostPaymentRequest]) (*connect.Response[pos.PaymentResponse], error) {
	usecase := do.MustInvoke[application.SavePayment](s.i)
	param, err := ToPaymentParam(req.Msg.Payment, req.Msg.PostOrders, req.Msg.OrderIds)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	payment, postOrderTickets, err := usecase.Execute(ctx, *param)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&pos.PaymentResponse{
		Status:  int32(payment.GetPaymentStatus()),
		Payment: ToProtoPayment(payment),
		OrderResponses: lo.Map(postOrderTickets, func(item *model.OrderTicket, index int) *pos.PostOrderResponse {
			return &pos.PostOrderResponse{
				CallNumber: item.GetTicketAddr(),
			}
		}),
	}), nil
}
