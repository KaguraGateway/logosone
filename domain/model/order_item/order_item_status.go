package orderitem

type OrderItemStatus uint

const (
	NotYet OrderItemStatus = iota
	Cooking
	Cooked
)
