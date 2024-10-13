package grpc_server

import (
	"context"
	"log"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/common"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/samber/do"
	"github.com/samber/lo"
)

func (s *GrpcServer) GetProductCategories(ctx context.Context, _ *connect.Request[common.Empty]) (*connect.Response[pos.GetProductCategoriesResponse], error) {
	usecase := do.MustInvoke[application.GetProductCategories](s.i)
	categories, err := usecase.Execute(ctx)
	if err != nil {
		log.Printf("%v", err)
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&pos.GetProductCategoriesResponse{
		ProductCategories: lo.Map(categories, func(category *model.ProductCategory, _ int) *pos.ProductCategory {
			return ToProtoProductCategory(category)
		}),
	}), nil
}
