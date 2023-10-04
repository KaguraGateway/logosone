package grpc_server

import (
	"connectrpc.com/connect"
	"context"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
)

func (s *GrpcServer) GetOrderBySeatId(ctx context.Context, req *connect.Request[pos.GetOrderBySeatIdRequest]) (*connect.Response[pos.GetOrderResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
