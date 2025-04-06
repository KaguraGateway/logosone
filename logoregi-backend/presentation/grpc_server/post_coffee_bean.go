package grpc_server

import (
	"context"
	"log"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/logosone/proto/pkg/common"
	"github.com/KaguraGateway/logosone/proto/pkg/pos"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/samber/do"
)

func (s *GrpcServer) PostCoffeeBean(ctx context.Context, req *connect.Request[pos.PostCoffeeBeanRequest]) (*connect.Response[common.Empty], error) {
	usecase := do.MustInvoke[application.PostCoffeeBean](s.i)
	if err := usecase.Execute(ctx, &application.PostCoffeeBeanParam{
		Name:         req.Msg.Name,
		GramQuantity: int(req.Msg.GramQuantity),
	}); err != nil {
		log.Printf("%v", err)
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&common.Empty{}), nil
}
