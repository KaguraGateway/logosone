package order

type OrderStatus uint

const (
	NotYet OrderStatus = iota
	Cooking
	Cooked
	Calling
	Provided
)
