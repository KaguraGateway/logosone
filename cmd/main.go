package main

import (
	"database/sql"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos/posconnect"
	"github.com/KaguraGateway/cafelogos-pos-backend/application"
	"github.com/KaguraGateway/cafelogos-pos-backend/infra/bundb"
	"github.com/KaguraGateway/cafelogos-pos-backend/presentation/grpc_server"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"github.com/samber/do"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
	"github.com/uptrace/bun/extra/bundebug"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
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
	db.AddQueryHook(bundebug.NewQueryHook(bundebug.WithVerbose(true)))
	defer db.Close()

	// Start DI
	i := buildInjector(db)

	// Start gRPC server
	mux := http.NewServeMux()
	path, handler := posconnect.NewPosServiceHandler(grpc_server.NewGrpcServer(db, i))
	mux.Handle(path, handler)
	http.ListenAndServe(fmt.Sprintf("0.0.0.0:%d", *port), cors.AllowAll().Handler(h2c.NewHandler(mux, &http2.Server{})))
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
	// Register QueryService
	do.Provide(i, bundb.NewProductQueryServiceDb)
	// Register usecase
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
	do.Provide(i, application.NewGetSeatsUseCase)
	do.Provide(i, application.NewPostSeatUseCase)
	do.Provide(i, application.NewUpdateSeatUseCase)

	return i
}
