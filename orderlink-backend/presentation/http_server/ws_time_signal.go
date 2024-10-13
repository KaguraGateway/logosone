package httpserver

import (
	"context"
	"log"
	"time"

	"github.com/KaguraGateway/logosone/orderlink-backend/domain/model"
	"github.com/KaguraGateway/logosone/orderlink-backend/domain/repository"
	"github.com/samber/do"
)

func StartWSTimeSignal(ctx context.Context, i *do.Injector) {
	clientPubSub := do.MustInvoke[repository.SrvToClientPubService](i)

	go func() {
		for {
			time.Sleep(1000 * time.Millisecond)
			event, _ := model.NewEvent("TimeSignal", time.Now().Unix())

			if err := clientPubSub.Publish(ctx, *event); err != nil {
				log.Printf("error from publish TimeSignal: %v", err)
			}
		}
	}()
}
