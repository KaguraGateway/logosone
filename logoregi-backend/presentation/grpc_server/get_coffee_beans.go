package grpc_server

import (
	"context"
	"log"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/logosone/proto/pkg/common"
	"github.com/KaguraGateway/logosone/proto/pkg/pos"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/samber/do"
	"github.com/samber/lo"
)

func (s *GrpcServer) GetCoffeeBeans(ctx context.Context, _ *connect.Request[common.Empty]) (*connect.Response[pos.GetCoffeeBeansResponse], error) {
	usecase := do.MustInvoke[application.GetCoffeeBeans](s.i)
	coffeeBeans, err := usecase.Execute(ctx)
	if err != nil {
		log.Printf("%v", err)
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&pos.GetCoffeeBeansResponse{
		CoffeeBeans: lo.Map(coffeeBeans, func(coffeeBean *model.CoffeeBean, _ int) *pos.CoffeeBean {
			return ToProtoCoffeeBean(coffeeBean)
		}),
	}), nil
}
