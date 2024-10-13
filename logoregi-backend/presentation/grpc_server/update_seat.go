package grpc_server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/common"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/samber/do"
)

func (s *GrpcServer) UpdateSeat(ctx context.Context, req *connect.Request[pos.UpdateSeatRequest]) (*connect.Response[common.Empty], error) {
	usecase := do.MustInvoke[application.UpdateSeat](s.i)
	param := &application.UpdateSeatParam{
		Id:   req.Msg.Seat.Id,
		Name: req.Msg.Seat.Name,
	}
	if err := usecase.Execute(ctx, param); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&common.Empty{}), nil
}
