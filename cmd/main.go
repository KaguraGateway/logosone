package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/samber/do"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
	"github.com/uptrace/bun/extra/bundebug"
	"golang.org/x/net/http2"

	"github.com/getsentry/sentry-go"
	sentryecho "github.com/getsentry/sentry-go/echo"

	"github.com/KaguraGateway/cafelogos-grpc/pkg/orderlink/orderlinkconnect"
	grpcserver "github.com/KaguraGateway/cafelogos-orderlink-backend/presentation/grpc_server"
	httpserver "github.com/KaguraGateway/cafelogos-orderlink-backend/presentation/http_server"
)

func main() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		panic(err)
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
	defer db.Close()

	// Build Injector
	i := buildInjector(db)

	// Start server
	app := echo.New()
	app.Use(middleware.Logger())
	app.Use(middleware.Recover())
	app.Use(sentryecho.New(sentryecho.Options{}))
	// gRPC
	path, handler := orderlinkconnect.NewOrderLinkServiceHandler(grpcserver.NewGrpcServer(i))
	app.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			if c.Path() == path {
				handler.ServeHTTP(c.Response(), c.Request())
				return nil
			}
			return next(c)
		}
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
		log.Fatal(err)
	}
}

func buildInjector(db *bun.DB) *do.Injector {
	i := do.New()

	return i
}
