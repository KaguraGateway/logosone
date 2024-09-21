package grpc_server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/common"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
	"github.com/KaguraGateway/cafelogos-pos-backend/application"
	"github.com/samber/do"
)

func (s *GrpcServer) UpdateProduct(ctx context.Context, req *connect.Request[pos.UpdateProductRequest]) (*connect.Response[common.Empty], error) {
	usecase := do.MustInvoke[application.UpdateProduct](s.i)
	param := ToProductParam(req.Msg.Product)
	if err := usecase.Execute(ctx, req.Msg.ProductId, param); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&common.Empty{}), nil
}
