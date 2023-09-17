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

func (s *GrpcServer) GetProducts(ctx context.Context, _ *proto.Empty) (*proto.GetProductsResponse, error) {
	usecase := do.MustInvoke[application.GetProducts](s.i)
	products, err := usecase.Execute(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}
	return &proto.GetProductsResponse{
		Products: lo.Map(products, func(product *model.Product, _ int) *proto.Product {
			amount, _ := product.GetAmount()
			return &proto.Product{
				ProductId:   product.GetId(),
				ProductName: product.ProductName.Get(),
				ProductCategory: ToProtoProductCategory(&product.ProductCategory),
				ProductType: proto.ProductType(product.ProductType),
				IsNowSales:  product.IsNowSales,
				CoffeeBean: ToProtoCoffeeBean(product.CoffeeBean),
				CoffeeBrews: lo.Map(*product.CoffeeBrews, func(coffeeBrew *model.ProductCoffeeBrew, _ int) *proto.CoffeeBrew {
					return ToProtoCoffeeBrew(coffeeBrew)
				}),
				Amount: amount,
				Stock: ToProtoStock(product.Stock),
			}
		}),
	}, nil
}
