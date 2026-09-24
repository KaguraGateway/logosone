package migrations

import (
	"context"
	"database/sql"

	"github.com/uptrace/bun"
)

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		err := db.RunInTx(ctx, &sql.TxOptions{}, func(ctx context.Context, tx bun.Tx) error {
			// 取消済みの決済を記録する。NULLなら未取消
			if _, err := tx.NewRaw("ALTER TABLE payments ADD COLUMN IF NOT EXISTS canceled_at TIMESTAMPTZ").Exec(ctx); err != nil {
				return err
			}
			return nil
		})
		return err
	}, func(ctx context.Context, db *bun.DB) error {
		err := db.RunInTx(ctx, &sql.TxOptions{}, func(ctx context.Context, tx bun.Tx) error {
			if _, err := tx.NewRaw("ALTER TABLE payments DROP COLUMN IF EXISTS canceled_at").Exec(ctx); err != nil {
				return err
			}
			return nil
		})
		return err
	})
}
