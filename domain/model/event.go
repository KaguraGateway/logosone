package model

import "github.com/KaguraGateway/cafelogos-orderlink-backend/domain"

type Event struct {
	topic   string
	message interface{}
}

func NewEvent(topic string, message interface{}) (*Event, error) {
	if len(topic) == 0 {
		return nil, domain.ErrInvalidEventTopic
	}

	return &Event{
		topic:   topic,
		message: message,
	}, nil
}

func RebuildEvent(topic string, message interface{}) *Event {
	return &Event{
		topic:   topic,
		message: message,
	}
}

func (p *Event) GetTopic() string {
	return p.topic
}

func (p *Event) GetMessage() interface{} {
	return p.message
}
