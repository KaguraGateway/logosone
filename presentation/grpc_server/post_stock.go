package grpc_server

import (
	"context"

	"github.com/KaguraGateway/cafelogos-grpc/pkg/proto"
	"github.com/KaguraGateway/cafelogos-pos-backend/application"
	"github.com/samber/do"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *GrpcServer) PostStock(ctx context.Context, req *proto.PostStockRequest) (*proto.Empty, error) {
	usecase := do.MustInvoke[application.PostStock](s.i)
	param := &application.PostStockParam{
		Name: req.Name,
		Quantity: int32(req.Quantity),
	}
	if err := usecase.Execute(ctx, param); err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}
	return &proto.Empty{}, nil
}
