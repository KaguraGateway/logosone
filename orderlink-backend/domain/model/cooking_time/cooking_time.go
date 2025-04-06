package cookingtime

type CookingTime struct {
	productId         string
	averageCookingTime int // 秒単位
	count             int  // 調理回数
}

func NewCookingTime(productId string) *CookingTime {
	return &CookingTime{
		productId:         productId,
		averageCookingTime: 0,
		count:             0,
	}
}

func RebuildCookingTime(productId string, averageCookingTime int, count int) *CookingTime {
	return &CookingTime{
		productId:         productId,
		averageCookingTime: averageCookingTime,
		count:             count,
	}
}

func (c *CookingTime) ProductId() string {
	return c.productId
}

func (c *CookingTime) AverageCookingTime() int {
	return c.averageCookingTime
}

func (c *CookingTime) Count() int {
	return c.count
}

func (c *CookingTime) AddCookingTime(newCookingTime int) {
	totalTime := c.averageCookingTime * c.count + newCookingTime
	c.count++
	c.averageCookingTime = totalTime / c.count
}
