package grpc_server

import (
	"context"

	"github.com/KaguraGateway/cafelogos-grpc/pkg/proto"
	"github.com/KaguraGateway/cafelogos-pos-backend/application"
	"github.com/samber/do"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *GrpcServer) PostProductCategory(ctx context.Context, req *proto.PostProductCategoryRequest) (*proto.Empty, error) {
	usecase := do.MustInvoke[application.PostProductCategory](s.i)
	param := application.PostProductCategoryParam{
		Name: req.Name,
	}
	if err := usecase.Execute(ctx, param); err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}
	return &proto.Empty{}, nil
}
