package migrations

import (
	"context"
	"database/sql"
	"github.com/uptrace/bun"
)

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		err := db.RunInTx(ctx, &sql.TxOptions{}, func(ctx context.Context, tx bun.Tx) error {
			if _, err := tx.NewRaw("ALTER TABLE order_items DROP CONSTRAINT order_items_pkey").Exec(ctx); err != nil {
				return err
			}
			if _, err := tx.NewRaw("ALTER TABLE order_items ADD CONSTRAINT order_items_pkey PRIMARY KEY(order_id,product_id,coffee_brew_id)").Exec(ctx); err != nil {
				return err
			}
			return nil
		})
		return err
	}, func(ctx context.Context, db *bun.DB) error {
		err := db.RunInTx(ctx, &sql.TxOptions{}, func(ctx context.Context, tx bun.Tx) error {
			if _, err := tx.NewRaw("ALTER TABLE order_items DROP CONSTRAINT order_items_pkey").Exec(ctx); err != nil {
				return err
			}
			if _, err := tx.NewRaw("ALTER TABLE order_items ADD CONSTRAINT order_items_pkey PRIMARY KEY(order_id,product_id)").Exec(ctx); err != nil {
				return err
			}
			return nil
		})
		return err
	})
}
