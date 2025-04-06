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
			DO $$
			BEGIN
				IF NOT EXISTS (
					SELECT 1 FROM information_schema.columns 
					WHERE table_name = 'payments' AND column_name = 'original_payment_id'
				) THEN
					ALTER TABLE payments ADD COLUMN original_payment_id text NULL;
				END IF;
			END $$;
		`)
		return err
	}, func(ctx context.Context, db *bun.DB) error {
		_, err := db.Exec(`
			ALTER TABLE payments
			ALTER COLUMN receive_amount TYPE bigint,
			ALTER COLUMN payment_amount TYPE bigint,
			ALTER COLUMN change_amount TYPE bigint;
			
			ALTER TABLE payments
			DROP COLUMN original_payment_id;
		`)
		return err
	})
}
