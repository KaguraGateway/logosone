package bundb

import (
	"context"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/KaguraGateway/cafelogos-pos-backend/infra/bundb/dao"
	"github.com/samber/do"
	"github.com/samber/lo"
	"github.com/uptrace/bun"
)

type discountDb struct {
	db *bun.DB
}

func NewDiscountDb(i *do.Injector) (repository.DiscountRepository, error) {
	return &discountDb{db: do.MustInvoke[*bun.DB](i)}, nil
}

func toDiscount(daoDiscount dao.Discount) *model.Discount {
	return model.ReconstructDiscount(daoDiscount.ID, daoDiscount.Name, model.DiscountType(daoDiscount.DiscountType), daoDiscount.DiscountPrice)
}

func (i *discountDb) FindAll(ctx context.Context) ([]*model.Discount, error) {
	daoDiscounts := make([]dao.Discount, 0)
	if err := i.db.NewSelect().Model(&daoDiscounts).Scan(ctx); err != nil {
		return nil, err
	}
	discounts := lo.Map(daoDiscounts, func(daoDiscount dao.Discount, _ int) *model.Discount {
		return toDiscount(daoDiscount)
	})
	return discounts, nil
}

func (i *discountDb) FindById(ctx context.Context, id string) (*model.Discount, error) {
	daoDiscount := new(dao.Discount)
	if err := i.db.NewSelect().Model(daoDiscount).Where("id = ?", id).Scan(ctx); err != nil {
		return nil, err
	}
	return toDiscount(*daoDiscount), nil
}

func (i *discountDb) Save(ctx context.Context, discount *model.Discount) error {
	daoDiscount := &dao.Discount{
		ID:            discount.GetId(),
		Name:          discount.GetName(),
		DiscountType:  int(discount.GetDiscountType()),
		DiscountPrice: discount.GetDiscountPrice(),
	}
	if _, err := i.db.NewInsert().Model(daoDiscount).On("CONFLICT (id) DO UPDATE").Set("name = EXCLUDED.name").Set("discount_type = EXCLUDED.discount_type").Set("discount_price = EXCLUDED.discount_price").Exec(ctx); err != nil {
		return err
	}
	return nil
}
