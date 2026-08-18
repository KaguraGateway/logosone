package migrations

import (
	"context"
	"fmt"

	"github.com/uptrace/bun"
)

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		fmt.Print(" [up migration] ")
		_, err := db.Exec(`ALTER TABLE product_coffee_brews ADD COLUMN preparation_time INT NOT NULL DEFAULT 0;`)
		return err
	}, func(ctx context.Context, db *bun.DB) error {
		fmt.Print(" [down migration] ")
		_, err := db.Exec(`ALTER TABLE product_coffee_brews DROP COLUMN preparation_time;`)
		return err
	})
}
