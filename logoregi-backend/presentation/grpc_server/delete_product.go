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

func (s *GrpcServer) DeleteProduct(ctx context.Context, req *connect.Request[pos.DeleteProductRequest]) (*connect.Response[common.Empty], error) {
	usecase := do.MustInvoke[application.DeleteProduct](s.i)
	if err := usecase.Execute(ctx, req.Msg.ProductId); err != nil {
		log.Printf("%v", err)
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&common.Empty{}), nil
}
