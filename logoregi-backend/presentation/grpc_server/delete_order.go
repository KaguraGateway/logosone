package grpc_server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/logosone/proto/pkg/common"
	"github.com/KaguraGateway/logosone/proto/pkg/pos"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/samber/do"
)

func (s *GrpcServer) DeleteOrder(ctx context.Context, req *connect.Request[pos.DeleteOrderRequest]) (*connect.Response[common.Empty], error) {
	usecase := do.MustInvoke[application.DeleteOrder](s.i)
	if err := usecase.Execute(ctx, req.Msg.OrderId); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&common.Empty{}), nil
}
