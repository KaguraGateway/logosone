package grpc_server

import (
	"connectrpc.com/connect"
	"context"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
)

func (s *GrpcServer) PostOrderPayment(ctx context.Context, req *connect.Request[pos.PostOrderPaymentRequest]) (*connect.Response[pos.OrderPaymentResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
