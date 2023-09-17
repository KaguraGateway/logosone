package dao

type Stock struct {
	ID       string `bun:",pk"`
	Name     string `bun:",notnull"`
	Quantity int    `bun:",notnull"`

	Products []*Product `bun:"rel:has-many"`
}
