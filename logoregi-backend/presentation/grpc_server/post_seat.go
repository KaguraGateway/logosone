package grpc_server

import (
	"connectrpc.com/connect"
	"context"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/common"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
	"github.com/KaguraGateway/cafelogos-pos-backend/application"
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
