package application

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/samber/do"
)

type GetOrders interface {
	Execute(ctx context.Context) ([]*model.Order, error)
}

type getOrdersUseCase struct {
	orderQS         OrderQueryService
	orderTicketRepo repository.OrderTicketRepository
}

func NewGetOrdersUseCase(i *do.Injector) (GetOrders, error) {
	return &getOrdersUseCase{
		orderQS:         do.MustInvoke[OrderQueryService](i),
		orderTicketRepo: do.MustInvoke[repository.OrderTicketRepository](i),
	}, nil
}

func (uc *getOrdersUseCase) Execute(ctx context.Context) ([]*model.Order, error) {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	orders, err := uc.orderQS.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	// オーダー番号はorder_ticketsにあるため、まとめて引いて詰める
	orderIds := make([]string, 0, len(orders))
	for _, order := range orders {
		orderIds = append(orderIds, order.GetId())
	}
	tickets, err := uc.orderTicketRepo.FindAllByOrderIds(ctx, orderIds)
	if err != nil {
		return nil, err
	}
	callNumbers := make(map[string]string, len(tickets))
	for _, ticket := range tickets {
		callNumbers[ticket.GetOrderId()] = ticket.GetTicketAddr()
	}
	for _, order := range orders {
		order.SetCallNumber(callNumbers[order.GetId()])
	}

	return orders, nil
}
