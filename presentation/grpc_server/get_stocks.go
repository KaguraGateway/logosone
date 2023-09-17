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

func (s *GrpcServer) GetStocks(ctx context.Context, _ *proto.Empty) (*proto.GetStocksResponse, error) {
	usecase := do.MustInvoke[application.GetStocks](s.i)
	stocks, err := usecase.Execute(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}
	return &proto.GetStocksResponse{
		Stocks: lo.Map(stocks, func(stock *model.Stock, _ int) *proto.Stock {
			return ToProtoStock(stock)
		}),
	}, nil
}
