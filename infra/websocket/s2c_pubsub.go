package websocket

import (
	"context"
	"time"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/repository"
	"github.com/gorilla/websocket"
	"github.com/samber/do"
)

type serverToClientPubSubWS struct {
	clients []*websocket.Conn
}

func NewServerToClientPubSubWS(i *do.Injector) (repository.SrvToClientPubService, error) {
	return &serverToClientPubSubWS{
		clients: do.MustInvoke[[]*websocket.Conn](i),
	}, nil
}

func (r *serverToClientPubSubWS) Publish(ctx context.Context, event model.Event) error {
	var resends []*websocket.Conn
	for _, client := range r.clients {
		if err := client.WriteJSON(event); err != nil {
			resends = append(resends, client)
		}
	}
	// 5秒待って再送
	if len(resends) > 0 {
		time.Sleep(5 * time.Second)
		for _, client := range resends {
			// 再送に失敗したらエラー握りつぶす
			client.WriteJSON(event)
		}
	}
	return nil
}
