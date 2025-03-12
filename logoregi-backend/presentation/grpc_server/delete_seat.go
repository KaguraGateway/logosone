package grpc_server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/common"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/samber/do"
)

func (s *GrpcServer) DeleteSeat(ctx context.Context, req *connect.Request[pos.DeleteSeatRequest]) (*connect.Response[common.Empty], error) {
	usecase := do.MustInvoke[application.DeleteSeat](s.i)
	if err := usecase.Execute(ctx, req.Msg.SeatId); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&common.Empty{}), nil
}
