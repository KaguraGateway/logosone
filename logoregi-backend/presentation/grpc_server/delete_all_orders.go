package grpc_server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/logosone/proto/pkg/common"
)

func (s *GrpcServer) DeleteAllOrders(ctx context.Context, req *connect.Request[common.Empty]) (*connect.Response[common.Empty], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
