package repository

import (
	"context"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
)

type SeatRepository interface {
	FindAll(ctx context.Context) ([]*model.Seat, error)
	FindById(ctx context.Context, id string) (*model.Seat, error)
	Save(ctx context.Context, stock *model.Seat) error
}
