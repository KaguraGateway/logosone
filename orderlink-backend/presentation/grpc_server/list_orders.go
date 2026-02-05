package grpcserver

import (
	"context"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/logosone/proto/pkg/common"
	"github.com/KaguraGateway/logosone/proto/pkg/orderlink"
)

func (r *GrpcServer) ListOrders(ctx context.Context, req *connect.Request[common.Empty]) (*connect.Response[orderlink.ListOrdersResponse], error) {

}
