package grpc_server

import (
	"context"
	"github.com/cockroachdb/errors"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/logosone/proto/pkg/pos"
)

func (s *GrpcServer) UpdatePayment(ctx context.Context, req *connect.Request[pos.UpdatePaymentRequest]) (*connect.Response[pos.PaymentResponse], error) {
	return nil, connect.NewError(connect.CodeInternal, errors.New("not implemented"))
}
