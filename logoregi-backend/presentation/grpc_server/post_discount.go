package grpc_server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/logosone/proto/pkg/common"
	"github.com/KaguraGateway/logosone/proto/pkg/pos"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/samber/do"
)

func (s *GrpcServer) PostDiscount(ctx context.Context, req *connect.Request[pos.PostDiscountRequest]) (*connect.Response[common.Empty], error) {
	usecase := do.MustInvoke[application.PostDiscount](s.i)
	param := application.PostDiscountParam{
		Name:          req.Msg.Name,
		DiscountType:  model.DiscountType(req.Msg.Type),
		DiscountPrice: req.Msg.DiscountPrice,
	}
	if err := usecase.Execute(ctx, param); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&common.Empty{}), nil
}
