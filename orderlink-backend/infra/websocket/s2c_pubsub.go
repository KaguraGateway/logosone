package websocket

import (
	"context"
	"log"
	"slices"
	"sync"

	"github.com/KaguraGateway/logosone/orderlink-backend/domain/model"
	"github.com/KaguraGateway/logosone/orderlink-backend/domain/repository"
	"github.com/gorilla/websocket"
	"github.com/samber/do"
)

type OrderLinkWSClient struct {
	*websocket.Conn
	mu sync.Mutex
}

func (c *OrderLinkWSClient) SafeWriteJSON(v interface{}) error {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.WriteJSON(v)
}

type serverToClientPubSubWS struct {
	clients *[]*OrderLinkWSClient
}

func NewServerToClientPubSubWS(i *do.Injector) (repository.SrvToClientPubService, error) {
	return &serverToClientPubSubWS{
		clients: do.MustInvoke[*[]*OrderLinkWSClient](i),
	}, nil
}

type eventOutput struct {
	Topic   string
	Message interface{}
}

func fromEvent(event *model.Event) *eventOutput {
	return &eventOutput{
		Topic:   event.GetTopic(),
		Message: event.GetMessage(),
	}
}

func (r *serverToClientPubSubWS) Publish(ctx context.Context, event model.Event) error {
	outputEvent := fromEvent(&event)

	for _, client := range *r.clients {
		if client == nil {
			log.Println("serverToClientPubSubWS, nil")
			return nil
		}

		if err := client.SafeWriteJSON(outputEvent); err != nil {
			log.Printf("Failed Client Publish: %v", err)
			if err := client.Close(); err != nil {
				log.Printf("Failed Client Close: %v", err)
			}
			*r.clients = slices.DeleteFunc(*r.clients, func(tConn *OrderLinkWSClient) bool {
				return tConn == client
			})
		}
	}

	return nil
}
