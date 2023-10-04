package grpc_server

import (
	"connectrpc.com/connect"
	"context"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
)

func (s *GrpcServer) UpdateOrderPayment(ctx context.Context, req *connect.Request[pos.UpdateOrderPaymentRequest]) (*connect.Response[pos.OrderPaymentResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
