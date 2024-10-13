package model

import "github.com/KaguraGateway/logosone/orderlink-backend/domain"

type OrderTicket struct {
	orderId    string
	ticketId   string
	ticketAddr string
}

func NewOrderTicket(orderId, ticketId, ticketAddr string) (*OrderTicket, error) {
	if len(orderId) == 0 {
		return nil, domain.ErrInvalidOrderId
	} else if len(ticketId) == 0 {
		return nil, domain.ErrInvalidTicketId
	} else if len(ticketAddr) == 0 {
		return nil, domain.ErrInvalidTicketAddr
	}

	return &OrderTicket{
		orderId:    orderId,
		ticketId:   ticketId,
		ticketAddr: ticketAddr,
	}, nil
}

func RebuildOrderTicket(orderId, ticketId, ticketAddr string) *OrderTicket {
	return &OrderTicket{
		orderId:    orderId,
		ticketId:   ticketId,
		ticketAddr: ticketAddr,
	}
}

func (o *OrderTicket) OrderId() string {
	return o.orderId
}

func (o *OrderTicket) TicketId() string {
	return o.ticketId
}

func (o *OrderTicket) TicketAddr() string {
	return o.ticketAddr
}
