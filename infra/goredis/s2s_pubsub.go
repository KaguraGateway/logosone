package goredis

import (
	"context"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/repository"
	"github.com/redis/go-redis/v9"
	"github.com/samber/do"
)

type serverToServerPubSubRedis struct {
	client *redis.Client
}

func NewServerToServerPubSubRedis(i *do.Injector) (repository.SrvToSrvPubSubService, error) {
	return &serverToServerPubSubRedis{
		client: do.MustInvoke[*redis.Client](i),
	}, nil
}

func (r *serverToServerPubSubRedis) Publish(ctx context.Context, event model.Event) error {
	return r.client.Publish(ctx, event.GetTopic(), event.GetMessage().(string)).Err()
}

func (r *serverToServerPubSubRedis) Subscribe(ctx context.Context, topic string, f func(ctx context.Context, event model.Event)) error {
	sub := r.client.Subscribe(ctx, topic)
	defer sub.Close()

	ch := sub.Channel()
	for msg := range ch {
		f(ctx, *model.RebuildEvent(topic, msg.Payload))
	}
	return nil
}
