package dao

type OrderTicket struct {
	OrderId    string `bun:",pk"`
	Order      *Order `bun:"rel:belongs-to,join:order_id=id"`
	TicketId   string `bun:",pk"`
	TicketAddr string
}
