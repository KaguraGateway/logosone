package grpc_server

import (
	"context"

	"github.com/KaguraGateway/cafelogos-grpc/pkg/proto"
	"github.com/KaguraGateway/cafelogos-pos-backend/application"
	"github.com/samber/do"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *GrpcServer) PostProduct(ctx context.Context, req *proto.PostProductRequest) (*proto.Empty, error) {
	usecase := do.MustInvoke[application.PostProduct](s.i)
	param := ToProductParam(req.Product)
	if err := usecase.Execute(ctx, param); err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}
	return &proto.Empty{}, nil
}
