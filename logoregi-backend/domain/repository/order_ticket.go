package repository

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
)

type OrderTicketRepository interface {
	Create(ctx context.Context, orderId string) (*model.OrderTicket, error)
	FindByOrderId(ctx context.Context, orderId string) (*model.OrderTicket, error)
	FindAllByOrderIds(ctx context.Context, orderIds []string) ([]*model.OrderTicket, error)
}
