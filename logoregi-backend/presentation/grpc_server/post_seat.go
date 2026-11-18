package grpc_server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/logosone/proto/pkg/common"
	"github.com/KaguraGateway/logosone/proto/pkg/pos"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/samber/do"
)

func (s *GrpcServer) PostSeat(ctx context.Context, req *connect.Request[pos.PostSeatRequest]) (*connect.Response[common.Empty], error) {
	usecase := do.MustInvoke[application.PostSeat](s.i)
	param := &application.PostSeatParam{
		Name: req.Msg.Name,
	}
	if err := usecase.Execute(ctx, param); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&common.Empty{}), nil
}
