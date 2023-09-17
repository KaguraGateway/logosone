package grpc_server

import (
	"context"
	"log"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/common"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
	"github.com/KaguraGateway/cafelogos-pos-backend/application"
	"github.com/samber/do"
)

func (s *GrpcServer) PostStock(ctx context.Context, req *connect.Request[pos.PostStockRequest]) (*connect.Response[common.Empty], error) {
	usecase := do.MustInvoke[application.PostStock](s.i)
	param := &application.PostStockParam{
		Name:     req.Msg.Name,
		Quantity: int32(req.Msg.Quantity),
	}
	if err := usecase.Execute(ctx, param); err != nil {
		log.Printf("%v", err)
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&common.Empty{}), nil
}
