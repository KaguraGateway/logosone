package repository

import (
	"context"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
)

type ClientRepository interface {
	Save(ctx context.Context, client *model.Client) error
}
