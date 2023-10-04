package grpc_server

import (
	"connectrpc.com/connect"
	"context"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
)

func (s *GrpcServer) PostNewClient(ctx context.Context, req *connect.Request[pos.PostNewClientRequest]) (*connect.Response[pos.PostNewClientResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
