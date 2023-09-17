package grpc_server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/common"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
)

func (s *GrpcServer) PostOrder(ctx context.Context, req *connect.Request[pos.PostOrderRequest]) (*connect.Response[common.Empty], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
