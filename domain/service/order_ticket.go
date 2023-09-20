package repository

type OrderTicketService interface {
	RevokeTicket(ticketId string) error
}
