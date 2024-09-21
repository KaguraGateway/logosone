package model

type OrderTicket struct {
	orderId    string
	ticketId   string
	ticketAddr string
}

func NewOrderTicket(orderId string, ticketId string, ticketAddr string) *OrderTicket {
	return &OrderTicket{
		orderId:    orderId,
		ticketId:   ticketId,
		ticketAddr: ticketAddr,
	}
}

func ReconstructOrderTicket(orderId string, ticketId string, ticketAddr string) *OrderTicket {
	return &OrderTicket{
		orderId:    orderId,
		ticketId:   ticketId,
		ticketAddr: ticketAddr,
	}
}

func (orderTicket *OrderTicket) GetOrderId() string {
	return orderTicket.orderId
}

func (orderTicket *OrderTicket) GetTicketId() string {
	return orderTicket.ticketId
}

func (orderTicket *OrderTicket) GetTicketAddr() string {
	return orderTicket.ticketAddr
}
