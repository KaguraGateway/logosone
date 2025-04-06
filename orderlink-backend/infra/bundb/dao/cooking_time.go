package dao

type CookingTime struct {
	ProductId         string `bun:",pk"`
	AverageCookingTime int    `bun:",notnull"`
	Count             int    `bun:",notnull"`
}
