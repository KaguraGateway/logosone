package model

type OrderTicket struct {
	orderId    string
	ticketId   string
	ticketAddr string
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
