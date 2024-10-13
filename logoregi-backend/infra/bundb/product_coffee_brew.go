package bundb

import (
	"context"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/KaguraGateway/logosone/logoregi-backend/infra/bundb/dao"
	"github.com/samber/do"
	"github.com/samber/lo"
	"github.com/uptrace/bun"
)

type productCoffeeBrewDb struct {
	db *bun.DB
}

func NewProductCoffeeBrewDb(i *do.Injector) (repository.ProductCoffeeBrewRepository, error) {
	return &productCoffeeBrewDb{db: do.MustInvoke[*bun.DB](i)}, nil
}

func toProductCoffeeBrew(daoProductCoffeeBrew dao.ProductCoffeeBrew) *model.ProductCoffeeBrew {
	return model.ReconstructProductCoffeeBrew(
		daoProductCoffeeBrew.ID,
		daoProductCoffeeBrew.ProductID,
		daoProductCoffeeBrew.Name,
		uint32(daoProductCoffeeBrew.BeanQuantityGrams),
		uint64(daoProductCoffeeBrew.Amount),
		synchro.In[tz.UTC](daoProductCoffeeBrew.CreatedAt),
		synchro.In[tz.UTC](daoProductCoffeeBrew.UpdatedAt),
	)
}

func (i *productCoffeeBrewDb) FindById(ctx context.Context, id string) (*model.ProductCoffeeBrew, error) {
	daoCoffeeBrew := new(dao.ProductCoffeeBrew)
	if err := i.db.NewSelect().Model(daoCoffeeBrew).Where("id = ?", id).Scan(ctx); err != nil {
		return nil, err
	}
	return toProductCoffeeBrew(*daoCoffeeBrew), nil
}

func (i *productCoffeeBrewDb) FindAllByProductId(ctx context.Context, productId string) ([]*model.ProductCoffeeBrew, error) {
	daoCoffeeBrews := make([]dao.ProductCoffeeBrew, 0)
	if err := i.db.NewSelect().Model(&daoCoffeeBrews).Where("product_id = ?", productId).Scan(ctx); err != nil {
		return nil, err
	}
	coffeeBrews := lo.Map(daoCoffeeBrews, func(daoCoffeeBrew dao.ProductCoffeeBrew, _ int) *model.ProductCoffeeBrew {
		return toProductCoffeeBrew(daoCoffeeBrew)
	})
	return coffeeBrews, nil
}

func (i *productCoffeeBrewDb) Save(ctx context.Context, productCoffeeBrew *model.ProductCoffeeBrew) error {
	daoCoffeeBrew := &dao.ProductCoffeeBrew{
		ID:                productCoffeeBrew.GetId(),
		ProductID:         productCoffeeBrew.GetProductId(),
		Name:              productCoffeeBrew.GetName(),
		BeanQuantityGrams: int(productCoffeeBrew.BeanQuantityGrams),
		Amount:            uint(productCoffeeBrew.Amount),
		CreatedAt:         productCoffeeBrew.GetCreatedAt().StdTime(),
		UpdatedAt:         productCoffeeBrew.GetUpdatedAt().StdTime(),
	}
	if _, err := i.db.NewInsert().Model(daoCoffeeBrew).On("CONFLICT (id) DO UPDATE").Set("name = EXCLUDED.name").Set("bean_quantity_grams = EXCLUDED.bean_quantity_grams").Set("amount = EXCLUDED.amount").Exec(ctx); err != nil {
		return err
	}
	return nil
}

func (i *productCoffeeBrewDb) Delete(ctx context.Context, id string) error {
	if _, err := i.db.NewDelete().Model((*dao.ProductCoffeeBrew)(nil)).Where("id = ?", id).Exec(ctx); err != nil {
		return err
	}
	return nil
}
