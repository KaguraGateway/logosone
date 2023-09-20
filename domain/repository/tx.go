package repository

import (
	"context"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
)

type TxRepository interface {
	Transaction(ctx context.Context, f func(ctx context.Context, tx model.Tx) error) error
}
