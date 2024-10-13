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

func (s *GrpcServer) GetStocks(ctx context.Context, _ *connect.Request[common.Empty]) (*connect.Response[pos.GetStocksResponse], error) {
	usecase := do.MustInvoke[application.GetStocks](s.i)
	stocks, err := usecase.Execute(ctx)
	if err != nil {
		log.Printf("%v", err)
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&pos.GetStocksResponse{
		Stocks: lo.Map(stocks, func(stock *model.Stock, _ int) *pos.Stock {
			return ToProtoStock(stock)
		}),
	}), nil
}
