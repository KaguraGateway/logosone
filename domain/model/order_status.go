package model

type OrderStatus uint

const (
	Prepare OrderStatus = iota
	Calling
	Provided
)
