package grpc_server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/common"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/samber/do"
)

func (s *GrpcServer) UpdateStock(ctx context.Context, req *connect.Request[struct {
	Id       string `json:"id" protobuf:"1"`
	Name     string `json:"name" protobuf:"2"`
	Quantity uint32 `json:"quantity" protobuf:"3"`
}]) (*connect.Response[common.Empty], error) {
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
