package repository

import (
	"context"

	"github.com/KaguraGateway/logosone/orderlink-backend/domain/model"
)

type OrderTicketRepository interface {
	FindByOrderId(ctx context.Context, orderId string) (*model.OrderTicket, error)
	SaveTx(ctx context.Context, tx interface{}, orderTicket *model.OrderTicket) error
}

type OrderTicketService interface {
	RevokeTicket(ticketId string) error
}
