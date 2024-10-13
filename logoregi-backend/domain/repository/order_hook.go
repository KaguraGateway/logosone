package repository

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
)

type OrderHookRepository interface {
	PostOrder(ctx context.Context, order *model.Order, ticket *model.OrderTicket) error
}
