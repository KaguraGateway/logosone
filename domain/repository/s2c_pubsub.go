package repository

import (
	"context"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
)

/**
 * Client <-> Server PubSub
 */
type SrvToClientPubSubService interface {
	Publish(ctx context.Context, event model.Event) error
	Subscribe(ctx context.Context, topic string, f func(event model.Event)) error
}
