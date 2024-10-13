package httpserver

import "github.com/KaguraGateway/logosone/orderlink-backend/domain/model"

type EventOutput struct {
	Topic   string
	Message interface{}
}

func FromEvent(event *model.Event) *EventOutput {
	return &EventOutput{
		Topic:   event.GetTopic(),
		Message: event.GetMessage(),
	}
}
