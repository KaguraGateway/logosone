package grpc_server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/logosone/proto/pkg/pos"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/samber/do"
)

func (s *GrpcServer) PostNewClient(ctx context.Context, req *connect.Request[pos.PostNewClientRequest]) (*connect.Response[pos.PostNewClientResponse], error) {
	usecase := do.MustInvoke[application.PostClient](s.i)
	param := application.PostClientParam{
		Name: req.Msg.Name,
	}
	client, err := usecase.Execute(ctx, param)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&pos.PostNewClientResponse{
		Id:   client.GetId(),
		Name: client.GetName(),
	}), nil
}
