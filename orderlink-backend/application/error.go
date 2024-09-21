package application

import "github.com/cockroachdb/errors"

var ErrInvalidParam = errors.New("invalid param")
var ErrOrderNotFound = errors.New("order not found")
var ErrOrderTicketNotFound = errors.New("order ticket not found")
var ErrOrderItemNotFound = errors.New("order item not found")
