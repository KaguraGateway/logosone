package dao

type OrderDiscount struct {
	ID            string    `bun:",pk"`
	OrderID       string    `bun:",notnull"`
	Order         *Order    `bun:"rel:belongs-to"`
	DiscountID    string    `bun:",notnull"`
	Discount      *Discount `bun:"rel:belongs-to"`
	DiscountPrice int
}
