package repository

import (
	"context"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
)

type OrderTicketRepository interface {
	Create(ctx context.Context, orderId string) (*model.OrderTicket, error)
}
