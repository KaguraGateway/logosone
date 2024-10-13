package grpc_server

import (
	"context"
	"log"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/common"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/samber/do"
	"github.com/samber/lo"
)

func (s *GrpcServer) GetProducts(ctx context.Context, _ *connect.Request[common.Empty]) (*connect.Response[pos.GetProductsResponse], error) {
	usecase := do.MustInvoke[application.GetProducts](s.i)
	products, err := usecase.Execute(ctx)
	if err != nil {
		log.Printf("%v", err)
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&pos.GetProductsResponse{
		Products: lo.Map(products, func(product *model.Product, _ int) *pos.Product {
			amount, _ := product.GetAmount()
			return &pos.Product{
				ProductId:       product.GetId(),
				ProductName:     product.ProductName.Get(),
				ProductCategory: ToProtoProductCategory(&product.ProductCategory),
				ProductType:     pos.ProductType(product.ProductType),
				IsNowSales:      product.IsNowSales,
				CreatedAt:       ToISO8601(product.GetCreatedAt()),
				UpdatedAt:       ToISO8601(product.GetUpdatedAt()),
				CoffeeBean:      ToProtoCoffeeBean(product.CoffeeBean),
				CoffeeBrews: lo.Map(product.CoffeeBrews, func(coffeeBrew *model.ProductCoffeeBrew, _ int) *pos.CoffeeBrew {
					return ToProtoCoffeeBrew(coffeeBrew)
				}),
				Amount: amount,
				Stock:  ToProtoStock(product.Stock),
			}
		}),
	}), nil
}
