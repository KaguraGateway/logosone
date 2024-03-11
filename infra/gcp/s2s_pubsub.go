package gcp

import (
	"cloud.google.com/go/pubsub"
	"context"
	"fmt"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/repository"
	"github.com/samber/do"
	"log"
)

type serverToServerPubSubCloudPubSub struct {
	client *pubsub.Client
}

func NewServerToServerPubSubCloudPubSub(i *do.Injector) (repository.SrvToSrvPubSubService, error) {
	return &serverToServerPubSubCloudPubSub{
		client: do.MustInvoke[*pubsub.Client](i),
	}, nil
}

func (r *serverToServerPubSubCloudPubSub) Publish(ctx context.Context, event model.Event) error {
	topic, err := r.client.CreateTopic(ctx, event.GetTopic())
	if err != nil {
		return err
	}

	topic.Publish(ctx, &pubsub.Message{
		Data: []byte(event.GetMessage().(string)),
	})
	log.Printf("S2S Published message: [%s] %q\n", event.GetTopic(), event.GetMessage().(string))
}

func (r *serverToServerPubSubCloudPubSub) Subscribe(ctx context.Context, channel string, callback func(context.Context, model.Event)) error {
	sub, err := r.client.CreateSubscription(ctx, fmt.Sprintf("sub-%s", channel), pubsub.SubscriptionConfig{
		Topic: r.client.Topic(channel),
	})
	if err != nil {
		return err
	}

	err = sub.Receive(ctx, func(ctx context.Context, msg *pubsub.Message) {
		log.Printf("S2S Received message: [%s] %q\n", channel, string(msg.Data))
		callback(ctx, *model.RebuildEvent(channel, string(msg.Data)))
		msg.Ack()
	})
	if err != nil {
		return err
	}
	return nil
}
