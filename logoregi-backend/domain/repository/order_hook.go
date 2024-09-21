package repository

import (
	"context"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
)

type OrderHookRepository interface {
	PostOrder(ctx context.Context, order *model.Order, ticket *model.OrderTicket) error
}
