package grpc_server

import (
	"connectrpc.com/connect"
	"context"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/common"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
)

func (s *GrpcServer) GetDailySales(context.Context, *connect.Request[common.Empty]) (*connect.Response[pos.GetDailySalesResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
