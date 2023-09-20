package order

type OrderType uint

const (
	EatIn OrderType = iota
	TakeOut
)
