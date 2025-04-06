package migrations

import (
	"context"

	"github.com/uptrace/bun"
)

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		_, err := db.Exec(`
			ALTER TABLE payments
			ALTER COLUMN receive_amount TYPE bigint,
			ALTER COLUMN payment_amount TYPE bigint,
			ALTER COLUMN change_amount TYPE bigint;
		`)
		if err != nil {
			return err
		}

		_, err = db.Exec(`
			ALTER TABLE payments
			ADD COLUMN original_payment_id text NULL;
		`)
		return err
	}, func(ctx context.Context, db *bun.DB) error {
		_, err := db.Exec(`
			ALTER TABLE payments
			ALTER COLUMN receive_amount TYPE bigint UNSIGNED,
			ALTER COLUMN payment_amount TYPE bigint UNSIGNED,
			ALTER COLUMN change_amount TYPE bigint UNSIGNED;
			
			ALTER TABLE payments
			DROP COLUMN original_payment_id;
		`)
		return err
	})
}
