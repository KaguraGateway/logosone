package websocket

import (
	"context"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/repository"
	"github.com/gorilla/websocket"
	"github.com/samber/do"
	"log"
	"slices"
)

type serverToClientPubSubWS struct {
	clients *[]*websocket.Conn
}

func NewServerToClientPubSubWS(i *do.Injector) (repository.SrvToClientPubService, error) {
	return &serverToClientPubSubWS{
		clients: do.MustInvoke[*[]*websocket.Conn](i),
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
		if err := client.WriteJSON(outputEvent); err != nil {
			log.Printf("Failed Client Publish: %v", err)
			if err := client.Close(); err != nil {
				log.Printf("Failed Client Close: %v", err)
			}
			*r.clients = slices.DeleteFunc(*r.clients, func(tConn *websocket.Conn) bool {
				return tConn == client
			})
		}
	}

	return nil
}
