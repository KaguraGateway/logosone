package grpc_server

import (
	"context"

	"github.com/KaguraGateway/cafelogos-grpc/pkg/proto"
	"github.com/KaguraGateway/cafelogos-pos-backend/application"
	"github.com/samber/do"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *GrpcServer) PostCoffeeBean(ctx context.Context, req *proto.PostCoffeeBeanRequest) (*proto.Empty, error) {
	usecase := do.MustInvoke[application.PostCoffeeBean](s.i)
	if err := usecase.Execute(ctx, &application.PostCoffeeBeanParam{
		Name:         req.Name,
		GramQuantity: int(req.GramQuantity),
	}); err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}
	return &proto.Empty{}, nil
}
