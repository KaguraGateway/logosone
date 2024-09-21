package pubsub

import (
	"context"
	"log"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/application"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
	"github.com/getsentry/sentry-go"
	"github.com/samber/do"
)

type OnUpdatedOrderStatus struct {
	usecase application.OnUpdatedOrderStatus
}

func NewOnUpdatedOrderStatus(i *do.Injector) *OnUpdatedOrderStatus {
	return &OnUpdatedOrderStatus{
		usecase: do.MustInvoke[application.OnUpdatedOrderStatus](i),
	}
}

func (r *OnUpdatedOrderStatus) On(ctx context.Context, event model.Event) {
	if err := r.usecase.Execute(ctx, event.GetMessage().(string)); err != nil {
		log.Printf("error from OnUpdatedOrderStatus: %v", err)
		sentry.CaptureException(err)
	}
}
