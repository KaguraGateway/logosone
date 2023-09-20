package model

type OrderType uint

const (
	EatIn OrderType = iota
	TakeOut
)
