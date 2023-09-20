package repository

import (
	"context"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
)

type OrderTicketRepository interface {
	FindByOrderId(ctx context.Context, orderId string) (*model.OrderTicket, error)
	SaveTx(ctx context.Context, tx model.Tx, orderTicket *model.OrderTicket) error
}

type OrderTicketService interface {
	RevokeTicket(ticketId string) error
}
