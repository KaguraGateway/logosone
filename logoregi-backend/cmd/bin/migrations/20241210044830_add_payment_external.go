package migrations

import (
	"context"
	"github.com/KaguraGateway/logosone/logoregi-backend/infra/bundb/dao"

	"github.com/uptrace/bun"
)

func init() {
	var models = []interface{}{
		(*dao.PaymentExternal)(nil),
		(*dao.OrderTicket)(nil),
	}

	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		for _, model := range models {
			if _, err := db.NewCreateTable().Model(model).Exec(ctx); err != nil {
				return err
			}
		}
		return nil
	}, func(ctx context.Context, db *bun.DB) error {
		for _, model := range models {
			if _, err := db.NewDropTable().Model(model).IfExists().Exec(ctx); err != nil {
				return err
			}
		}
		return nil
	})
}
