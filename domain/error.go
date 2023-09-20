package domain

import "github.com/cockroachdb/errors"

var ErrInvalidProductId = errors.New("invalid product id")
var ErrInvalidProductCoffeeBrewId = errors.New("invalid product coffee brew id")
var ErrInvalidOrderId = errors.New("invalid order id")
var ErrInvalidTicketId = errors.New("invalid ticket id")
var ErrInvalidTicketAddr = errors.New("invalid ticket addr")
var ErrInvalidEventTopic = errors.New("invalid event topic")
var ErrCantOperationOrderStatus = errors.New("OrderStatus must be either one ahead or one ahead.")