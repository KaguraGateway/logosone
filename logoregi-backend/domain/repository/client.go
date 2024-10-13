package repository

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
)

type ClientRepository interface {
	Save(ctx context.Context, client *model.Client) error
}
