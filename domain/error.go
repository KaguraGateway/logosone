package domain

import "github.com/cockroachdb/errors"

var ErrInvalidProductId = errors.New("invalid product id")
var ErrInvalidProductName = errors.New("invalid product name")
var ErrInvalidProductCategoryId = errors.New("invalid product category id")
var ErrInvalidProductCategoryName = errors.New("invalid product category name")
var ErrInvalidProductCoffeeBrewId = errors.New("invalid product coffee brew id")
var ErrInvalidProductCoffeeBrewName = errors.New("invalid product coffee brew name")
var ErrInvalidOrderId = errors.New("invalid order id")
var ErrInvalidTicketId = errors.New("invalid ticket id")
var ErrInvalidTicketAddr = errors.New("invalid ticket addr")
var ErrInvalidEventTopic = errors.New("invalid event topic")
