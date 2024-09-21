package dao

type Client struct {
	ID   string `bun:",pk"`
	Name string `bun:",notnull"`
}
