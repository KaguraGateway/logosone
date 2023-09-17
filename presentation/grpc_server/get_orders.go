package grpc_server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
)

func (s *GrpcServer) GetOrders(ctx context.Context, req *connect.Request[pos.GetOrdersRequest]) (*connect.Response[pos.GetOrdersResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
