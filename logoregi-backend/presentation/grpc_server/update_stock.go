package grpc_server

import (
	"context"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/common"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/samber/do"
)

func (s *GrpcServer) UpdateStock(ctx context.Context, req *connect.Request[pos.UpdateStockRequest]) (*connect.Response[common.Empty], error) {
	usecase := do.MustInvoke[application.UpdateStock](s.i)
	param := &application.UpdateStockParam{
		Id:       req.Msg.Id,
		Name:     req.Msg.Name,
		Quantity: int32(req.Msg.Quantity),
	}
	if err := usecase.Execute(ctx, param); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&common.Empty{}), nil
}
