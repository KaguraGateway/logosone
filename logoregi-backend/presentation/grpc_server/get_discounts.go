package grpc_server

import (
	"connectrpc.com/connect"
	"context"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/common"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
	"github.com/KaguraGateway/cafelogos-pos-backend/application"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/samber/do"
	"github.com/samber/lo"
)

func (s *GrpcServer) GetDiscounts(ctx context.Context, _ *connect.Request[common.Empty]) (*connect.Response[pos.GetDiscountsResponse], error) {
	usecase := do.MustInvoke[application.GetDiscounts](s.i)
	discounts, err := usecase.Execute(ctx)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&pos.GetDiscountsResponse{
		Discounts: lo.Map(discounts, func(discount *model.Discount, _ int) *pos.Discount {
			return ToProtoDiscount(discount)
		}),
	}), nil
}
