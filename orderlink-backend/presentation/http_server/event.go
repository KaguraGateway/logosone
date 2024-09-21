package httpserver

import "github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"

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
