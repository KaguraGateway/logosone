package repository

import (
	"context"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
)

/**
 * Client <-> Server Pub
 */
type SrvToClientPubService interface {
	Publish(ctx context.Context, event model.Event) error
}
