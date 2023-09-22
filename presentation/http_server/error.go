package httpserver

import "github.com/cockroachdb/errors"

var ErrTypeAssertion = errors.New("Type assertion error")
var ErrExecute = errors.New("Execute error")
var ErrNewEvent = errors.New("NewEvent error")
var ErrWriteJSON = errors.New("WriteJSON error")
