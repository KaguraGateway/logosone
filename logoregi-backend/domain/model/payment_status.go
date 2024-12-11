package model

type PaymentStatus int

const (
	PaymentStatusPending PaymentStatus = iota
	PaymentStatusSuccess
)
