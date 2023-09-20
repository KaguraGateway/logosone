package model

type OrderItemStatus uint

const (
	NotYet OrderItemStatus = iota
	Cooking
	Cooked
)
