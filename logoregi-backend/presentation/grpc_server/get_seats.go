package grpc_server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/logosone/proto/pkg/common"
	"github.com/KaguraGateway/logosone/proto/pkg/pos"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/samber/do"
	"github.com/samber/lo"
)

func (s *GrpcServer) GetSeats(ctx context.Context, req *connect.Request[common.Empty]) (*connect.Response[pos.GetSeatsResponse], error) {
	usecase := do.MustInvoke[application.GetSeats](s.i)
	seats, err := usecase.Execute(ctx)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&pos.GetSeatsResponse{
		Seats: lo.Map(seats, func(seat *model.Seat, _ int) *pos.Seat {
			return &pos.Seat{
				Id:   seat.GetId(),
				Name: seat.GetName(),
			}
		}),
	}), nil
}
