package dao

type Discount struct {
	ID            string `bun:",pk"`
	DiscountType  int    `bun:",notnull"`
	DiscountPrice int

	OrderDiscounts []*OrderDiscount `bun:"rel:has-many"`
}
