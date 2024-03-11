package main

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/infra/gcp"
	"github.com/getsentry/sentry-go"
	"github.com/labstack/echo/v4"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4/middleware"
	"github.com/redis/go-redis/v9"
	"github.com/samber/do"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
	"github.com/uptrace/bun/extra/bundebug"
	"golang.org/x/net/http2"

	gorilla "github.com/gorilla/websocket"

	cloudpubsub "cloud.google.com/go/pubsub"

	sentryecho "github.com/getsentry/sentry-go/echo"

	"github.com/KaguraGateway/cafelogos-grpc/pkg/orderlink/orderlinkconnect"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/application"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/infra/bundb"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/infra/websocket"
	grpcserver "github.com/KaguraGateway/cafelogos-orderlink-backend/presentation/grpc_server"
	httpserver "github.com/KaguraGateway/cafelogos-orderlink-backend/presentation/http_server"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/presentation/pubsub"
)

func main() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Print(err)
	}
	// 開発環境であるか、そうでないかを判定する
	var isDev = false
	if _, ok := os.LookupEnv("DEV_MODE"); ok {
		isDev = true
	}

	// Sentry
	if err := sentry.Init(sentry.ClientOptions{
		Dsn:           os.Getenv("SENTRY_DSN"),
		EnableTracing: true,
		// Set TracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production,
		TracesSampleRate: 1.0,
	}); err != nil {
		fmt.Printf("Sentry initialization failed: %v", err)
	}

	// Start DB
	sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(os.Getenv("DATABASE_URL"))))
	db := bun.NewDB(sqldb, pgdialect.New())
	db.AddQueryHook(bundebug.NewQueryHook(bundebug.WithVerbose(true)))
	defer func(db *bun.DB) {
		err := db.Close()
		if err != nil {
			log.Fatal(err)
		}
	}(db)

	// WebSocket Clients
	wsClients := make([]*gorilla.Conn, 0)

	var redisClient *redis.Client
	var cloudPubSubClient *cloudpubsub.Client
	// Start Redis Client (Only Dev)
	if isDev {
		redisClient = redis.NewClient(&redis.Options{
			Addr:     os.Getenv("REDIS_URL"),
			Password: os.Getenv("REDIS_PASSWORD"),
			DB:       0,
		})
	} else {
		var err error
		cloudPubSubClient, err = cloudpubsub.NewClient(context.Background(), os.Getenv("GCP_PROJECT_ID"))
		if err != nil {
			log.Fatalf("Cloud Pub/Sub NewClient: %v", err)
		}
	}

	// Build Injector
	i := buildInjector(isDev, db, wsClients, redisClient, cloudPubSubClient)

	// PubSub Subscribe
	pubsubReceiver := pubsub.NewPubSubReceiver(i)
	pubsubReceiver.SubscriptionRegister(context.Background())

	// Start server
	app := echo.New()
	app.Use(middleware.Logger())
	app.Use(middleware.Recover())
	app.Use(sentryecho.New(sentryecho.Options{}))
	// gRPC
	path, handler := orderlinkconnect.NewOrderLinkServiceHandler(grpcserver.NewGrpcServer(i))
	app.Any(fmt.Sprintf("%s*", path), func(c echo.Context) error {
		handler.ServeHTTP(c.Response(), c.Request())
		return nil
	})
	// HTTP
	httpserver.RegisterRoutes(app, i)

	port, err := strconv.Atoi(os.Getenv("PORT"))
	if err != nil {
		panic(err)
	}

	h2s := &http2.Server{
		MaxConcurrentStreams: 250,
		MaxReadFrameSize:     1048576,
		IdleTimeout:          10 * time.Second,
	}
	if err := app.StartH2CServer(fmt.Sprintf(":%d", port), h2s); err != http.ErrServerClosed {
		app.Logger.Fatal(err)
	}
}

func buildInjector(isDev bool, db *bun.DB, wsClients []*gorilla.Conn, redisClient *redis.Client, cloudPubSubClient *cloudpubsub.Client) *do.Injector {
	i := do.New()

	// Register DB
	do.Provide(i, func(i *do.Injector) (*bun.DB, error) {
		return db, nil
	})
	// Register WebSocket
	do.Provide(i, func(i *do.Injector) (*[]*gorilla.Conn, error) {
		return &wsClients, nil
	})
	// Register RedisClient
	do.Provide(i, func(i *do.Injector) (*redis.Client, error) {
		return redisClient, nil
	})
	// Register CloudPubSubClient
	do.Provide(i, func(i *do.Injector) (*cloudpubsub.Client, error) {
		return cloudPubSubClient, nil
	})
	// Register Repo
	do.Provide(i, bundb.NewOrderItemRepositoryDb)
	do.Provide(i, bundb.NewOrderTicketRepositoryDb)
	do.Provide(i, bundb.NewOrderRepositoryDb)
	do.Provide(i, bundb.NewTxRepositoryDb)
	do.Provide(i, websocket.NewServerToClientPubSubWS)
	// Register S2S PubSub
	if !isDev {
		do.Provide(i, gcp.NewServerToServerPubSubCloudPubSub)
	}
	// Register QueryService
	do.Provide(i, bundb.NewOrderQueryServiceDb)
	// Register UseCase
	do.Provide(i, application.NewGetOrdersUseCase)
	do.Provide(i, application.NewOnReceiveOrderUseCase)
	do.Provide(i, application.NewOnUpdatedOrderItemStatusUseCase)
	do.Provide(i, application.NewOnUpdatedOrderStatusUseCase)
	do.Provide(i, application.NewPostOrderFromPosUseCase)
	do.Provide(i, application.NewUpdateOrderItemStatusUseCase)
	do.Provide(i, application.NewUpdateOrderStatusUseCase)

	return i
}
