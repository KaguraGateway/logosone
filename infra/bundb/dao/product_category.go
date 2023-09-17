package dao

type ProductCategory struct {
	ID   string `bun:",pk"`
	Name string `bun:",notnull"`

	Products []*Product `bun:"rel:has-many"`
}
