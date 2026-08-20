package migrations

import (
	"context"

	"github.com/uptrace/bun"
)

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		_, err := db.NewAddColumn().
			Table("orders").
			ColumnExpr("status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE'").
			Exec(ctx)
		return err
	}, func(ctx context.Context, db *bun.DB) error {
		_, err := db.NewDropColumn().
			Table("orders").
			Column("status").
			Exec(ctx)
		return err
	})
}
