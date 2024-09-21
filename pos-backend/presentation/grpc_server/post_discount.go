package grpc_server

import (
	"connectrpc.com/connect"
	"context"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/common"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
	"github.com/KaguraGateway/cafelogos-pos-backend/application"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
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
