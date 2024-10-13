package grpc_server

import (
	"context"
	"log"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/common"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/samber/do"
)

func (s *GrpcServer) PostProductCategory(ctx context.Context, req *connect.Request[pos.PostProductCategoryRequest]) (*connect.Response[common.Empty], error) {
	usecase := do.MustInvoke[application.PostProductCategory](s.i)
	param := application.PostProductCategoryParam{
		Name: req.Msg.Name,
	}
	if err := usecase.Execute(ctx, param); err != nil {
		log.Printf("%v", err)
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&common.Empty{}), nil
}
