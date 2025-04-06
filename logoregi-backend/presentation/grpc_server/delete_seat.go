package grpc_server

import (
	"connectrpc.com/connect"
	"context"
	"github.com/KaguraGateway/logosone/proto/pkg/common"
	"github.com/KaguraGateway/logosone/proto/pkg/pos"
)

func (s *GrpcServer) DeleteSeat(ctx context.Context, c *connect.Request[pos.DeleteSeatRequest]) (*connect.Response[common.Empty], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
