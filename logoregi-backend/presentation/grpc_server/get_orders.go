package grpc_server

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/samber/do"
	"github.com/samber/lo"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
)

func (s *GrpcServer) GetOrders(ctx context.Context, req *connect.Request[pos.GetOrdersRequest]) (*connect.Response[pos.GetOrdersResponse], error) {
	usecase := do.MustInvoke[application.GetOrders](s.i)
	orders, err := usecase.Execute(ctx)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&pos.GetOrdersResponse{
		Orders: lo.Map(orders, func(order *model.Order, _ int) *pos.Order {
			return ToProtoOrder(order)
		}),
	}), nil
}
