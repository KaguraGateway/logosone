package grpc_server

import (
	"connectrpc.com/connect"
	"context"
	"github.com/KaguraGateway/logosone/proto/pkg/common"
	"github.com/KaguraGateway/logosone/proto/pkg/pos"
)

func (s *GrpcServer) UpdateClient(ctx context.Context, req *connect.Request[pos.UpdateClientRequest]) (*connect.Response[common.Empty], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
