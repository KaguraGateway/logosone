package migrations

import (
	"context"
	"database/sql"
	"github.com/uptrace/bun"
)

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		err := db.RunInTx(ctx, &sql.TxOptions{}, func(ctx context.Context, tx bun.Tx) error {
			if _, err := tx.NewRaw("ALTER TABLE products ADD COLUMN IF NOT EXISTS is_managing_order BOOLEAN").Exec(ctx); err != nil {
				return err
			}
			if _, err := tx.NewRaw("UPDATE products SET is_managing_order = TRUE").Exec(ctx); err != nil {
				return err
			}
			if _, err := tx.NewRaw("ALTER TABLE products ALTER COLUMN IF NOT EXISTS is_managing_order ADD NOT NULL").Exec(ctx); err != nil {
				return err
			}

			if _, err := tx.NewRaw("ALTER TABLE products ADD COLUMN IF NOT EXISTS is_ol_use_kitchen BOOLEAN").Exec(ctx); err != nil {
				return err
			}
			if _, err := tx.NewRaw("UPDATE products SET is_ol_use_kitchen = TRUE").Exec(ctx); err != nil {
				return err
			}
			if _, err := tx.NewRaw("ALTER TABLE products ALTER COLUMN IF NOT EXISTS is_ol_use_kitchen ADD NOT NULL").Exec(ctx); err != nil {
				return err
			}
			return nil
		})
		return err
	}, func(ctx context.Context, db *bun.DB) error {
		err := db.RunInTx(ctx, &sql.TxOptions{}, func(ctx context.Context, tx bun.Tx) error {
			if _, err := tx.NewRaw("ALTER TABLE products DROP COLUMN is_managing_order").Exec(ctx); err != nil {
				return err
			}
			if _, err := tx.NewRaw("ALTER TABLE products DROP COLUMN is_ol_use_kitchen").Exec(ctx); err != nil {
				return err
			}
			return nil
		})
		return err
	})
}
