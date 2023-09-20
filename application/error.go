package application

import "github.com/cockroachdb/errors"

var ErrInvalidParam = errors.New("invalid param")
var ErrOrderNotFound = errors.New("order not found")
