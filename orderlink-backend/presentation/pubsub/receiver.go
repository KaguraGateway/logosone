package pubsub

import (
	"context"
	"log"

	"github.com/KaguraGateway/logosone/orderlink-backend/domain/model"
	"github.com/KaguraGateway/logosone/orderlink-backend/domain/repository"
	"github.com/getsentry/sentry-go"
	"github.com/samber/do"
)

type PubSubReceiver struct {
	pubsub                   repository.SrvToSrvPubSubService
	onReceiveOrder           *OnReceiveOrder
	onUpdatedOrderItemStatus *OnUpdatedOrderItemStatus
	onUpdatedOrderStatus     *OnUpdatedOrderStatus
}

func NewPubSubReceiver(i *do.Injector) *PubSubReceiver {
	return &PubSubReceiver{
		pubsub:                   do.MustInvoke[repository.SrvToSrvPubSubService](i),
		onReceiveOrder:           NewOnReceiveOrder(i),
		onUpdatedOrderItemStatus: NewOnUpdatedOrderItemStatus(i),
		onUpdatedOrderStatus:     NewOnUpdatedOrderStatus(i),
	}
}

func (r *PubSubReceiver) SubscriptionRegister(ctx context.Context) {
	topics := map[string]func(context.Context, model.Event){
		"NewOrder":               r.onReceiveOrder.On,
		"UpdatedOrderItemStatus": r.onUpdatedOrderItemStatus.On,
		"UpdatedOrderStatus":     r.onUpdatedOrderStatus.On,
	}
	// Topic Register
	for topic, callback := range topics {
		go func(topic string, callback func(context.Context, model.Event)) {
			if err := r.pubsub.Subscribe(ctx, topic, callback); err != nil {
				log.Printf("error from subscribe topic: %s, err: %v", topic, err)
				sentry.CaptureException(err)
			}
		}(topic, callback)
	}
}
