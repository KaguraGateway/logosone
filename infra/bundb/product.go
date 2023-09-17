package bundb

import (
	"context"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/KaguraGateway/cafelogos-pos-backend/infra/bundb/dao"
	"github.com/samber/do"
	"github.com/uptrace/bun"
)

type productDb struct {
	db *bun.DB
}

func NewProductDb(i *do.Injector) (repository.ProductRepository, error) {
	return &productDb{db: do.MustInvoke[*bun.DB](i)}, nil
}

func (i *productDb) Save(ctx context.Context, product *model.Product) error {
	amount, _ := product.GetAmount()

	daoProduct := &dao.Product{
		ID:           product.GetId(),
		Name:         product.ProductName.Get(),
		CategoryID:   product.ProductCategory.GetId(),
		ProductType:  uint(product.ProductType),
		IsNowSales:   product.IsNowSales,
		CoffeeBeanID: product.CoffeeBean.GetId(),
		Amount:       uint(amount),
		StockId:      product.Stock.GetId(),
	}
	if _, err := i.db.NewInsert().Model(daoProduct).On("CONFLICT (id) DO UPDATE").Set("name = EXCLUDED.name").Set("category_id = EXCLUDED.category_id").Set("product_type = EXCLUDED.product_type").Set("is_now_sales = EXCLUDED.is_now_sales").Set("coffee_bean_id = EXCLUDED.coffee_bean_id").Set("amount = EXCLUDED.amount").Set("stock_id = EXCLUDED.stock_id").Exec(ctx); err != nil {
		return err
	}
	return nil
}

func (i *productDb) Delete(ctx context.Context, id string) error {
	if _, err := i.db.NewDelete().Model((*dao.Product)(nil)).Where("id = ?", id).Exec(ctx); err != nil {
		return err
	}
	return nil
}