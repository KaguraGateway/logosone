package repository

import "github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"

type OrderTicketRepository interface {
	FindById(id string) (*model.OrderTicket, error)
	Save(orderTicket *model.OrderTicket) error
}
