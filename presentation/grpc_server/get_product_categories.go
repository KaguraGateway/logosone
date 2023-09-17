package grpc_server

import (
	"context"

	"github.com/KaguraGateway/cafelogos-grpc/pkg/proto"
	"github.com/KaguraGateway/cafelogos-pos-backend/application"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/samber/do"
	"github.com/samber/lo"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *GrpcServer) GetProductCategories(ctx context.Context, _ *proto.Empty) (*proto.GetProductCategoriesResponse, error) {
	usecase := do.MustInvoke[application.GetProductCategories](s.i)
	categories, err := usecase.Execute(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}
	return &proto.GetProductCategoriesResponse{
		ProductCategories: lo.Map(categories, func(category *model.ProductCategory, _ int) *proto.ProductCategory {
			return ToProtoProductCategory(category)
		}),
	}, nil
}
