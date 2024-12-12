package domain_event

type DomainEvent interface {
	EventName() string
}

type DomainEventHandler interface {
	Handle(event DomainEvent)
}

type domainEventDispatcher struct {
	handlers map[string][]DomainEventHandler
}

func (d *domainEventDispatcher) Subscribe(eventName string, handler DomainEventHandler) {
	d.handlers[eventName] = append(d.handlers[eventName], handler)
}

func (d *domainEventDispatcher) Dispatch(event DomainEvent) {
	for _, handler := range d.handlers[event.EventName()] {
		handler.Handle(event)
	}
}

var DomainEventDispatcher = &domainEventDispatcher{
	handlers: make(map[string][]DomainEventHandler),
}
