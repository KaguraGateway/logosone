package grpc_server

import (
	"context"

	"github.com/KaguraGateway/cafelogos-grpc/pkg/proto"
	"github.com/KaguraGateway/cafelogos-pos-backend/application"
	"github.com/samber/do"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *GrpcServer) DeleteProduct(ctx context.Context, req *proto.DeleteProductRequest) (*proto.Empty, error) {
	usecase := do.MustInvoke[application.DeleteProduct](s.i)
	if err := usecase.Execute(ctx, req.ProductId); err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}
	return &proto.Empty{}, nil
}
