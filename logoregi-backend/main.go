package main

import (
	connectcors "connectrpc.com/cors"
	"context"
	"crypto/tls"
	"database/sql"
	"flag"
	"fmt"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/domain_event"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/KaguraGateway/logosone/logoregi-backend/infra/square"
	"github.com/KaguraGateway/logosone/logoregi-backend/presentation/http_server"
	"github.com/joho/godotenv"
	"log"
	"net"
	"net/http"
	"os"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/orderlink/orderlinkconnect"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/ticket/ticketconnect"
	"github.com/KaguraGateway/logosone/logoregi-backend/infra/orderlink_server"
	"github.com/KaguraGateway/logosone/logoregi-backend/infra/ticket_server"
	"golang.org/x/net/http2"

	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos/posconnect"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/KaguraGateway/logosone/logoregi-backend/infra/bundb"
	"github.com/KaguraGateway/logosone/logoregi-backend/presentation/grpc_server"
	"github.com/rs/cors"
	"github.com/samber/do"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
	"github.com/uptrace/bun/extra/bundebug"
)

var (
	port = flag.Int("port", 8080, "port to listen on")
)

func main() {
	// 開発環境であるか、そうでないかを判定する
	var isDev = false
	if _, ok := os.LookupEnv("DEV_MODE"); ok {
		isDev = true

		// Load .env
		if err := godotenv.Load(); err != nil {
			log.Print(err)
		}
	}

	if _, ok := os.LookupEnv("DATABASE_URL"); !ok {
		log.Fatal("DATABASE_URL is not set")
	}

	// Start DB
	sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(os.Getenv("DATABASE_URL"))))
	db := bun.NewDB(sqldb, pgdialect.New())
	db.AddQueryHook(bundebug.NewQueryHook(bundebug.WithVerbose(true)))
	defer func(db *bun.DB) {
		err := db.Close()
		if err != nil {
			panic(err)
		}
	}(db)

	// Start Ticket Client
	var ticketHttpClient = http.DefaultClient
	if isDev {
		ticketHttpClient = &http.Client{
			Transport: &http2.Transport{
				AllowHTTP: true,
				DialTLSContext: func(ctx context.Context, network, addr string, cfg *tls.Config) (net.Conn, error) {
					return net.Dial(network, addr)
				},
			},
		}
	}
	ticketClient := ticketconnect.NewTicketServiceClient(
		ticketHttpClient,
		os.Getenv("TICKET_GRPC"),
		connect.WithGRPC(),
	)
	// Start OrderLink Client
	orderLinkClient := orderlinkconnect.NewOrderLinkServiceClient(
		http.DefaultClient,
		os.Getenv("ORDERLINK_GRPC"),
	)

	// Start DI
	i := buildInjector(db, ticketClient, orderLinkClient)

	// FIXME: 一旦ドメインイベント周りのコードを書く
	registerDomainEventHandler(context.Background(), i)
	squarePolling := do.MustInvoke[application.PaymentExternalService](i)
	err := squarePolling.Polling(context.Background())
	if err != nil {
		return
	}

	// Start gRPC server
	mux := http.NewServeMux()
	path, handler := posconnect.NewPosServiceHandler(grpc_server.NewGrpcServer(db, i))
	mux.Handle(path, handler)
	squareWebhooks := http_server.NewSquareTerminalWebhooks(i)
	mux.Handle("/api/v1/webhooks/square/terminal", http.HandlerFunc(squareWebhooks.Handle))
	corsHandler := withCORS(mux)
	if err := http.ListenAndServe(fmt.Sprintf("0.0.0.0:%d", *port), corsHandler); err != nil {
		panic(err)
	}
}

func withCORS(h http.Handler) http.Handler {
	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: connectcors.AllowedMethods(),
		AllowedHeaders: connectcors.AllowedHeaders(),
		ExposedHeaders: connectcors.ExposedHeaders(),
	})
	return corsMiddleware.Handler(h)
}

type onPaymentSuccessEventHandler struct {
	ctx             context.Context
	orderHookRepo   repository.OrderHookRepository
	orderService    application.OrderQueryService
	orderTicketRepo repository.OrderTicketRepository
	paymentRepo     repository.PaymentRepository
}

func (handler *onPaymentSuccessEventHandler) Handle(event domain_event.DomainEvent) {
	paymentSuccessEvent := event.(*domain_event.PaymentSuccessEvent)
	log.Printf("PaymentSuccessEvent: %v", paymentSuccessEvent)

	order, err := handler.orderService.FindByPaymentId(handler.ctx, paymentSuccessEvent.PaymentId())
	if err != nil {
		log.Printf("failed to find order by payment id: %v", err)
		return
	}

	payment, err := handler.paymentRepo.FindById(handler.ctx, paymentSuccessEvent.PaymentId())
	if err != nil {
		log.Printf("failed to find payment by payment id: %v", err)
		return
	}
	if payment.GetPaymentType() == model.External {
		payment.ReceiveAmount = payment.PaymentAmount
	}
	if err := handler.paymentRepo.Save(handler.ctx, payment); err != nil {
		log.Printf("failed to save payment: %v", err)
		return
	}

	// テイクアウトの場合のみOrderLinkに通知するため、イートインの場合はここで通知しない
	if order.GetOrderType() != model.TakeOut {
		return
	}

	orderTicket, err := handler.orderTicketRepo.FindByOrderId(handler.ctx, order.GetId())
	if err != nil {
		log.Printf("failed to find order ticket by order id: %v", err)
		return
	}

	// FIXME: OrderLinkに通知しているが、この状態だとテイクアウトとイートインの区別で問題になるので、OrderLinkに通知するタイミングを変更する必要がある
	if err := handler.orderHookRepo.PostOrder(handler.ctx, order, orderTicket); err != nil {
		log.Printf("failed to post order: %v", err)
	}
}

func registerDomainEventHandler(ctx context.Context, i *do.Injector) {
	domain_event.DomainEventDispatcher.Subscribe(domain_event.PaymentSuccessEventName, &onPaymentSuccessEventHandler{
		ctx:             ctx,
		orderHookRepo:   do.MustInvoke[repository.OrderHookRepository](i),
		orderService:    do.MustInvoke[application.OrderQueryService](i),
		orderTicketRepo: do.MustInvoke[repository.OrderTicketRepository](i),
		paymentRepo:     do.MustInvoke[repository.PaymentRepository](i),
	})
}

func buildInjector(db *bun.DB, ticketClient ticketconnect.TicketServiceClient, orderLinkClient orderlinkconnect.OrderLinkServiceClient) *do.Injector {
	i := do.New()

	// Register DB
	do.Provide(i, func(i *do.Injector) (*bun.DB, error) {
		return db, nil
	})
	do.Provide(i, func(i *do.Injector) (ticketconnect.TicketServiceClient, error) {
		return ticketClient, nil
	})
	do.Provide(i, func(i *do.Injector) (orderlinkconnect.OrderLinkServiceClient, error) {
		return orderLinkClient, nil
	})
	// Register repositories
	do.Provide(i, bundb.NewCoffeeBeanDb)
	do.Provide(i, bundb.NewStockDb)
	do.Provide(i, bundb.NewProductCategoryDb)
	do.Provide(i, bundb.NewProductCoffeeBrewDb)
	do.Provide(i, bundb.NewProductDb)
	do.Provide(i, bundb.NewSeatDb)
	do.Provide(i, bundb.NewClientDb)
	do.Provide(i, bundb.NewDiscountDb)
	do.Provide(i, bundb.NewOrderDb)
	do.Provide(i, bundb.NewOrderDiscountDb)
	do.Provide(i, bundb.NewOrderItemDb)
	do.Provide(i, bundb.NewPaymentDb)
	do.Provide(i, bundb.NewPaymentExternalDb)
	do.Provide(i, bundb.NewTxRepositoryDb)
	// gRPC Repository
	do.Provide(i, ticket_server.NewOrderTicketServer)
	do.Provide(i, orderlink_server.NewOrderHookOrderLink)
	// Register QueryService
	do.Provide(i, bundb.NewProductQueryServiceDb)
	do.Provide(i, bundb.NewOrderQueryServiceDb)
	do.Provide(i, bundb.NewSalesQueryServiceDb)
	do.Provide(i, square.NewSquarePaymentExternalService)
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
	do.Provide(i, application.NewUpdateStockUseCase)
	do.Provide(i, application.NewUpdateProductUseCase)
	do.Provide(i, application.NewGetSeatsUseCase)
	do.Provide(i, application.NewPostSeatUseCase)
	do.Provide(i, application.NewUpdateSeatUseCase)
	do.Provide(i, application.NewGetOrdersUseCase)
	do.Provide(i, application.NewGetUnpaidOrdersBySeatIdUseCase)
	do.Provide(i, application.NewPostOrderUseCase)
	do.Provide(i, application.NewDeleteOrderUseCase)
	do.Provide(i, application.NewSavePaymentUseCase)
	do.Provide(i, application.NewGetDiscountsUseCase)
	do.Provide(i, application.NewPostDiscountUseCase)
	do.Provide(i, application.NewPostClientUseCase)
	do.Provide(i, application.NewGetExternalPaymentUseCase)
	do.Provide(i, application.NewRefundPaymentUseCase)
	// 売上分析用のユースケース
	do.Provide(i, application.NewGetDailySales)
	do.Provide(i, application.NewGetProductSales)
	do.Provide(i, application.NewGetSalesByTimeSlot)
	do.Provide(i, application.NewGetSalesByPaymentType)

	return i
}
