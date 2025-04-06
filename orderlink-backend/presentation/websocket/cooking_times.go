package websocket

import (
	"context"
	"log"
	"time"

	"github.com/KaguraGateway/logosone/orderlink-backend/application"
	"github.com/KaguraGateway/logosone/orderlink-backend/domain/model"
	"github.com/KaguraGateway/logosone/orderlink-backend/domain/repository"
	"github.com/samber/do"
)

type CookingTimesHandler struct {
	getCookingTimes application.GetCookingTimes
	pubsub          repository.SrvToClientPubService
}

func NewCookingTimesHandler(i *do.Injector) (*CookingTimesHandler, error) {
	return &CookingTimesHandler{
		getCookingTimes: do.MustInvoke[application.GetCookingTimes](i),
		pubsub:          do.MustInvoke[repository.SrvToClientPubService](i),
	}, nil
}

func (h *CookingTimesHandler) Start(ctx context.Context) {
	go func() {
		ticker := time.NewTicker(10 * time.Second)
		defer ticker.Stop()

		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				h.sendCookingTimes(ctx)
			}
		}
	}()
}

func (h *CookingTimesHandler) sendCookingTimes(ctx context.Context) {
	cookingTimes, err := h.getCookingTimes.Execute(ctx)
	if err != nil {
		log.Printf("Failed to get cooking times: %v", err)
		return
	}

	data := map[string]interface{}{
		"type": "CookingTimes",
		"data": map[string]interface{}{
			"CookingTimes": cookingTimes,
		},
	}

	event, err := model.NewEvent("CookingTimes", data)
	if err != nil {
		log.Printf("Failed to create cooking times event: %v", err)
		return
	}

	if err := h.pubsub.Publish(ctx, *event); err != nil {
		log.Printf("Failed to publish cooking times: %v", err)
	}
}
