package repository

import (
	"context"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
)

/**
 * Server <-> Server PubSub
 */
type SrvToSrvPubSubService interface {
	Publish(ctx context.Context, event model.Event) error
	Subscribe(ctx context.Context, topic string, f func(event model.Event)) error
}
