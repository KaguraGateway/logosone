package application

import (
	"context"
	"fmt"
	"log"

	"connectrpc.com/connect"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/samber/do"

	"github.com/KaguraGateway/cafelogos-grpc/pkg/orderlink"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/orderlink/orderlinkconnect"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/ticket"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/ticket/ticketconnect"
)

type CancelOrder interface {
	Execute(ctx context.Context, orderId string) error
}

type cancelOrderUseCase struct {
	orderQS   OrderQueryService
	orderRepo repository.OrderRepository
	productQS ProductQueryService
	stockRepo repository.StockRepository
	txRepo    repository.TxRepository

	orderLinkClient orderlinkconnect.OrderLinkServiceClient
	ticketClient    ticketconnect.TicketServiceClient
}

func NewCancelOrderUseCase(i *do.Injector) (CancelOrder, error) {
	return &cancelOrderUseCase{
		orderQS:         do.MustInvoke[OrderQueryService](i),
		orderRepo:       do.MustInvoke[repository.OrderRepository](i),
		productQS:       do.MustInvoke[ProductQueryService](i),
		stockRepo:       do.MustInvoke[repository.StockRepository](i),
		txRepo:          do.MustInvoke[repository.TxRepository](i),
		orderLinkClient: do.MustInvoke[orderlinkconnect.OrderLinkServiceClient](i),
		ticketClient:    do.MustInvoke[ticketconnect.TicketServiceClient](i),
	}, nil
}

func (uc *cancelOrderUseCase) Execute(ctx context.Context, orderId string) error {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	order, err := uc.orderQS.FindById(ctx, orderId)
	if err != nil {
		return fmt.Errorf("failed to find order: %w", err)
	}

	if order.GetStatus() == model.OrderStatusCanceled {
		return nil
	}

	statusMap := make(map[string]int32)
	olReq := connect.NewRequest(&orderlink.CancelOrderInput{
		OrderID: orderId,
	})
	olResp, err := uc.orderLinkClient.CancelOrder(ctx, olReq)

	if err == nil && olResp != nil && olResp.Msg != nil {
		for _, item := range olResp.Msg.Items {
			statusMap[item.ProductID] = item.Status
		}
	} else {
		log.Printf("OrderLink cancel warning (maybe not sent to kitchen): %v", err)
	}

	err = uc.txRepo.Transaction(ctx, func(ctx context.Context, tx interface{}) error {
		var updateStocks []*model.Stock
		for _, item := range order.GetOrderItems() {
			product, err := uc.productQS.FindById(ctx, item.GetProductId())
			if err != nil {
				return err
			}
			if product.Stock != nil {
				shouldRestore := false

				if product.ProductType == model.ProductType(model.Other) {
					shouldRestore = true
				} else if product.ProductType == model.ProductType(model.Coffee) {
					if status, exists := statusMap[product.GetId()]; exists {
						if status == 0 {
							shouldRestore = true
						}
					} else {
						shouldRestore = true
					}
				}
				if shouldRestore {
					product.Stock.Quantity += int32(item.Quantity)
					updateStocks = append(updateStocks, product.Stock)
				}
			}
		}

		for _, stock := range updateStocks {
			if err := uc.stockRepo.SaveTx(ctx, tx, stock); err != nil {
				return err
			}
		}

		if err := uc.orderRepo.UpdateStatus(ctx, orderId, model.OrderStatusCanceled); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return fmt.Errorf("transaction failed: %w", err)
	}

	ticketReq := connect.NewRequest(&ticket.RequestRevokeTicket{
		ID: orderId,
	})
	_, err = uc.ticketClient.RevokeTicket(ctx, ticketReq)
	if err != nil {
		log.Printf("failed to revoke ticket (maybe no ticket): %v", err)
	}

	return nil
}
