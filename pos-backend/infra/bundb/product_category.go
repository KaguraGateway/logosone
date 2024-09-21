package bundb

import (
	"context"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/KaguraGateway/cafelogos-pos-backend/infra/bundb/dao"
	"github.com/samber/do"
	"github.com/samber/lo"
	"github.com/uptrace/bun"
)

type productCategoryDb struct {
	db *bun.DB
}

func NewProductCategoryDb(i *do.Injector) (repository.ProductCategoryRepository, error) {
	return &productCategoryDb{db: do.MustInvoke[*bun.DB](i)}, nil
}

func toProductCategory(daoProductCategory dao.ProductCategory) *model.ProductCategory {
	return model.ReconstructProductCategory(daoProductCategory.ID, daoProductCategory.Name, synchro.In[tz.UTC](daoProductCategory.CreatedAt), synchro.In[tz.UTC](daoProductCategory.UpdatedAt))
}

func (i *productCategoryDb) FindAll(ctx context.Context) ([]*model.ProductCategory, error) {
	daoProductCategories := make([]dao.ProductCategory, 0)
	if err := i.db.NewSelect().Model(&daoProductCategories).Scan(ctx); err != nil {
		return nil, err
	}
	productCategories := lo.Map(daoProductCategories, func(daoProductCategory dao.ProductCategory, _ int) *model.ProductCategory {
		return toProductCategory(daoProductCategory)
	})
	return productCategories, nil
}

func (i *productCategoryDb) FindById(ctx context.Context, id string) (*model.ProductCategory, error) {
	daoProductCategory := new(dao.ProductCategory)
	if err := i.db.NewSelect().Model(daoProductCategory).Where("id = ?", id).Scan(ctx); err != nil {
		return nil, err
	}
	return toProductCategory(*daoProductCategory), nil
}

func (i *productCategoryDb) Save(ctx context.Context, productCategory *model.ProductCategory) error {
	daoProductCategory := &dao.ProductCategory{
		ID:        productCategory.GetId(),
		Name:      productCategory.GetName(),
		CreatedAt: productCategory.GetCreatedAt().StdTime(),
		UpdatedAt: productCategory.GetUpdatedAt().StdTime(),
	}
	if _, err := i.db.NewInsert().Model(daoProductCategory).On("CONFLICT (id) DO UPDATE").Set("name = EXCLUDED.name").Exec(ctx); err != nil {
		return err
	}
	return nil
}
