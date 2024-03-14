package httpserver

import (
	"context"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/repository"
	"github.com/samber/do"
	"log"
	"time"
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
