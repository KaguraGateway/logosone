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

func (s *GrpcServer) PostPayment(ctx context.Context, req *connect.Request[pos.PostPaymentRequest]) (*connect.Response[pos.PaymentResponse], error) {
	usecase := do.MustInvoke[application.SavePayment](s.i)
	param, err := ToPaymentParam(req.Msg.Payment)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	payment, postOrderTickets, err := usecase.Execute(ctx, *param)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&pos.PaymentResponse{
		IsOk:    true,
		Payment: ToProtoPayment(payment),
		OrderResponses: lo.Map(postOrderTickets, func(item *model.OrderTicket, index int) *pos.PostOrderResponse {
			return &pos.PostOrderResponse{
				CallNumber: item.GetTicketAddr(),
			}
		}),
	}), nil
}
