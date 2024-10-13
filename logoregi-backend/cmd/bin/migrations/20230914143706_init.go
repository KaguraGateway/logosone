package migrations

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/infra/bundb/dao"
	"github.com/uptrace/bun"
)

func init() {
	var models = []interface{}{
		(*dao.Client)(nil),
		(*dao.CoffeeBean)(nil),
		(*dao.Discount)(nil),
		(*dao.Order)(nil),
		(*dao.OrderDiscount)(nil),
		(*dao.OrderItem)(nil),
		(*dao.OrderPayment)(nil),
		(*dao.Payment)(nil),
		(*dao.Product)(nil),
		(*dao.ProductCategory)(nil),
		(*dao.ProductCoffeeBrew)(nil),
		(*dao.Stock)(nil),
		(*dao.Seat)(nil),
		(*dao.Denomination)(nil),
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
