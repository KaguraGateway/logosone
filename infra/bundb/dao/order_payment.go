package dao

type OrderPayment struct {
	ID        string   `bun:",pk"`
	OrderID   string   `bun:",notnull"`
	Order     *Order   `bun:"rel:belongs-to,join:order_id=id"`
	PaymentID string   `bun:",notnull"`
	Payment   *Payment `bun:"rel:belongs-to,join:payment_id=id"`
}
