package dao

type Discount struct {
	ID            string `bun:",pk"`
	Name          string `bun:",notnull"`
	DiscountType  int    `bun:",notnull"`
	DiscountPrice uint64

	OrderDiscounts []*OrderDiscount `bun:"rel:has-many,join:id=discount_id"`
}
