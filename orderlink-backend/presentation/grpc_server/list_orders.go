package grpcserver

import (
	"context"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/logosone/orderlink-backend/application"
	"github.com/KaguraGateway/logosone/proto/pkg/common"
	"github.com/KaguraGateway/logosone/proto/pkg/orderlink"
	"github.com/samber/do"
	"github.com/samber/lo"
)

func (r *GrpcServer) ListOrders(ctx context.Context, req *connect.Request[common.Empty]) (*connect.Response[orderlink.ListOrdersResponse], error) {
	usecase := do.MustInvoke[application.ListOrders](r.i)

	// Executeを呼び出そう
	orders, err := usecase.Execute(ctx)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	// 返り値をorderlink.ListOrdersResponseに変換して返す
	resOrders := lo.Map(orders, func(or *application.ListOrdersOutput, _ int) *orderlink.Order {
		servedAt := or.ServedAt.Format("2006-01-02T15:04:05Z")

		return &orderlink.Order{
			OrderId:    or.OrderId,
			OrderAt:    or.OrderAt.Format("2006-01-02T15:04:05Z"),
			Type:       orderlink.Order_OrderType(or.Type),
			TicketId:   "",
			TicketAddr: "",
			Status:     orderlink.Order_OrderStatus(or.Status),
			ServedAt:   &servedAt,
		}
	})

	return connect.NewResponse(&orderlink.ListOrdersResponse{
		Orders: resOrders,
	}), nil
}
