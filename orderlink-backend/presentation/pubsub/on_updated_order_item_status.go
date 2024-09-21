package pubsub

import (
	"context"
	"log"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/application"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
	"github.com/getsentry/sentry-go"
	"github.com/samber/do"
)

type OnUpdatedOrderItemStatus struct {
	usecase application.OnUpdatedOrderItemStatus
}

func NewOnUpdatedOrderItemStatus(i *do.Injector) *OnUpdatedOrderItemStatus {
	return &OnUpdatedOrderItemStatus{
		usecase: do.MustInvoke[application.OnUpdatedOrderItemStatus](i),
	}
}

func (r *OnUpdatedOrderItemStatus) On(ctx context.Context, event model.Event) {
	if err:= r.usecase.Execute(ctx, event.GetMessage().(string)); err != nil {
		log.Printf("error from OnUpdatedOrderItemStatus: %v", err)
		sentry.CaptureException(err)
	}
}
