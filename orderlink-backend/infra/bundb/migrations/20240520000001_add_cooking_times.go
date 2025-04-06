package migrations

import (
	"context"

	"github.com/uptrace/bun"
)

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		_, err := db.ExecContext(ctx, `
			ALTER TABLE order_items 
			ADD COLUMN cooking_start_time TIMESTAMP,
			ADD COLUMN cooking_end_time TIMESTAMP;
		`)
		if err != nil {
			return err
		}

		_, err = db.ExecContext(ctx, `
			CREATE TABLE cooking_times (
				product_id VARCHAR NOT NULL PRIMARY KEY,
				average_cooking_time INTEGER NOT NULL,
				count INTEGER NOT NULL
			);
		`)
		return err
	}, func(ctx context.Context, db *bun.DB) error {
		_, err := db.ExecContext(ctx, `
			ALTER TABLE order_items 
			DROP COLUMN cooking_start_time,
			DROP COLUMN cooking_end_time;
		`)
		if err != nil {
			return err
		}

		_, err = db.ExecContext(ctx, `DROP TABLE IF EXISTS cooking_times;`)
		return err
	})
}
