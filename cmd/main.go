package main

import (
	"database/sql"
	"flag"
	"fmt"
	"log"
	"net"
	"os"

	"github.com/KaguraGateway/cafelogos-grpc/pkg/proto"
	"github.com/KaguraGateway/cafelogos-pos-backend/application"
	"github.com/KaguraGateway/cafelogos-pos-backend/infra/bundb"
	"github.com/KaguraGateway/cafelogos-pos-backend/presentation/grpc_server"
	"github.com/joho/godotenv"
	"github.com/samber/do"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
	"google.golang.org/grpc"
)

var (
	port = flag.Int("port", 8080, "port to listen on")
)

func main() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}

	// Start DB
	sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(os.Getenv("DATABASE_URL"))))
	db := bun.NewDB(sqldb, pgdialect.New())
	defer db.Close()

	// Start DI
	i := buildInjector(db)

	// Start gRPC server
	listener, err := net.Listen("tcp", fmt.Sprintf("0.0.0.0:%d", *port))
	if err != nil {
		log.Fatalf("failed to listen: %v\n", err)
	}
	grpcServer := grpc.NewServer()
	proto.RegisterPosServiceServer(grpcServer, grpc_server.NewGrpcServer(db, i))
	grpcServer.Serve(listener)
}

func buildInjector(db *bun.DB) *do.Injector {
	i := do.New()

	// Register DB
	do.Provide(i, func(i *do.Injector) (*bun.DB, error) {
		return db, nil
	})
	// Register repositories
	do.Provide(i, bundb.NewCoffeeBeanDb)
	do.Provide(i, bundb.NewStockDb)
	do.Provide(i, bundb.NewProductCategoryDb)
	do.Provide(i, bundb.NewProductCoffeeBrewDb)
	do.Provide(i, bundb.NewProductDb)
	// Register usecases
	do.Provide(i, application.NewDeleteProductUseCase)
	do.Provide(i, application.NewGetCoffeeBeansUseCase)
	do.Provide(i, application.NewGetProductCategoriesUseCase)
	do.Provide(i, application.NewGetProductsUseCase)
	do.Provide(i, application.NewGetStocksUseCase)
	do.Provide(i, application.NewPostCoffeeBeanUseCase)
	do.Provide(i, application.NewPostProductCategoryUseCase)
	do.Provide(i, application.NewPostProductUseCase)
	do.Provide(i, application.NewPostStockUseCase)
	do.Provide(i, application.NewUpdateProductUseCase)

	return i
}
