package grpc_server

import (
	"context"

	"github.com/KaguraGateway/cafelogos-grpc/pkg/proto"
	"github.com/KaguraGateway/cafelogos-pos-backend/application"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/samber/do"
	"github.com/samber/lo"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *GrpcServer) GetCoffeeBeans(ctx context.Context, _ *proto.Empty) (*proto.GetCoffeeBeansResponse, error) {
	usecase := do.MustInvoke[application.GetCoffeeBeans](s.i)
	coffeeBeans, err := usecase.Execute(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}
	return &proto.GetCoffeeBeansResponse{
		CoffeeBeans: lo.Map(coffeeBeans, func(coffeeBean *model.CoffeeBean, _ int) *proto.CoffeeBean {
			return ToProtoCoffeeBean(coffeeBean)
		}),
	}, nil
}
