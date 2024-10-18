package grpcserver

import (
	"context"

	"connectrpc.com/connect"
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/common"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/orderlink"
	"github.com/KaguraGateway/logosone/orderlink-backend/application"
	"github.com/KaguraGateway/logosone/orderlink-backend/domain/model/order"
	"github.com/samber/do"
	"github.com/samber/lo"
)

func (r *GrpcServer) PostOrder(ctx context.Context, req *connect.Request[orderlink.PostOrderInput]) (*connect.Response[common.Empty], error) {
	usecase := do.MustInvoke[application.PostOrderFromPos](r.i)
	msg := req.Msg

	orderAt, err := synchro.ParseISO[tz.UTC](msg.OrderAt)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	input := &application.PostOrderInput{
		OrderId: msg.OrderId,
		OrderAt: orderAt,
		OrderItems: lo.Map(msg.Items, func(item *orderlink.PostOrderItemInput, _ int) application.PostOrderItemInput {
			return application.PostOrderItemInput{
				ProductId:       item.ProductId,
				CoffeeBrewId:    &item.CoffeeBrewId,
				Quantity:        uint(item.Quantity),
				IsManagingOrder: item.IsManagingOrder,
				IsOlUseKitchen:  item.IsOlKitchen, // TODO: 名前が違うのを直したい
			}
		}),
		OrderType:  order.OrderType(msg.Type),
		TicketId:   msg.TicketId,
		TicketAddr: msg.TicketAddr,
		SeatName:   &msg.SeatName,
	}
	if err := usecase.Execute(ctx, input); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&common.Empty{}), nil
}
