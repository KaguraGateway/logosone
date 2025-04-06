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

func (s *GrpcServer) PostProduct(ctx context.Context, req *connect.Request[pos.PostProductRequest]) (*connect.Response[common.Empty], error) {
	usecase := do.MustInvoke[application.PostProduct](s.i)
	param := ToProductParam(req.Msg.Product)
	if err := usecase.Execute(ctx, param); err != nil {
		log.Printf("%v", err)
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&common.Empty{}), nil
}
