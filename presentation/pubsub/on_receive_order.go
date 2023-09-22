package pubsub

import (
	"context"
	"log"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/application"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
	"github.com/getsentry/sentry-go"
	"github.com/samber/do"
)

type OnReceiveOrder struct {
	usecase application.OnReceiveOrder
}

func NewOnReceiveOrder(i *do.Injector) *OnReceiveOrder {
	return &OnReceiveOrder{
		usecase: do.MustInvoke[application.OnReceiveOrder](i),
	}
}

func (r *OnReceiveOrder) On(ctx context.Context, event model.Event) {
	if err := r.usecase.Execute(ctx, event.GetMessage().(string)); err != nil {
		log.Printf("error from OnReceiveOrder: %v", err)
		sentry.CaptureException(err)
	}
}
