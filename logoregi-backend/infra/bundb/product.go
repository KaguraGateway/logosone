package bundb

import (
	"context"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/KaguraGateway/logosone/logoregi-backend/infra/bundb/dao"
	"github.com/samber/do"
	"github.com/samber/lo"
	"github.com/uptrace/bun"
)

type productDb struct {
	db *bun.DB
}

func NewProductDb(i *do.Injector) (repository.ProductRepository, error) {
	return &productDb{db: do.MustInvoke[*bun.DB](i)}, nil
}

func (i *productDb) Save(ctx context.Context, product *model.Product) error {
	// Only Coffee
	coffeeBeanId := ""
	if product.ProductType == model.ProductType(model.Coffee) {
		coffeeBeanId = product.CoffeeBean.GetId()
	}
	// Only Other
	amount, _ := product.GetAmount()
	stockId := ""
	if product.ProductType == model.ProductType(model.Other) {
		stockId = product.Stock.GetId()
	}

	daoProduct := &dao.Product{
		ID:           product.GetId(),
		Name:         product.ProductName.Get(),
		CategoryID:   product.ProductCategory.GetId(),
		ProductType:  uint(product.ProductType),
		Color:        product.Color,
		IsNowSales:   product.IsNowSales,
		CoffeeBeanID: coffeeBeanId,
		Amount:       amount,
		StockId:      stockId,
		CreatedAt:    product.GetCreatedAt().StdTime(),
		UpdatedAt:    product.GetUpdatedAt().StdTime(),
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

type productQueryServiceDb struct {
	db *bun.DB
}

func NewProductQueryServiceDb(i *do.Injector) (application.ProductQueryService, error) {
	return &productQueryServiceDb{db: do.MustInvoke[*bun.DB](i)}, nil
}

func toProduct(product *dao.Product) *model.Product {
	productCategory := model.ReconstructProductCategory(product.Category.ID, product.Category.Name, synchro.In[tz.UTC](product.Category.CreatedAt), synchro.In[tz.UTC](product.Category.UpdatedAt))

	// Only Coffee
	var coffeeBean *model.CoffeeBean
	if product.CoffeeBean != nil {
		coffeeBean = model.ReconstructCoffeeBean(product.CoffeeBean.ID, product.CoffeeBean.Name, product.CoffeeBean.GramQuantity, synchro.In[tz.UTC](product.CoffeeBean.CreatedAt), synchro.In[tz.UTC](product.CoffeeBean.UpdatedAt))
	}
	var productCoffeeBrews []*model.ProductCoffeeBrew
	if product.CoffeeBrews != nil {
		productCoffeeBrews = lo.Map(product.CoffeeBrews, func(coffeeBrew *dao.ProductCoffeeBrew, _ int) *model.ProductCoffeeBrew {
			return model.ReconstructProductCoffeeBrew(coffeeBrew.ID, coffeeBrew.ProductID, coffeeBrew.Name, uint32(coffeeBrew.BeanQuantityGrams), uint64(coffeeBrew.Amount), synchro.In[tz.UTC](coffeeBrew.CreatedAt), synchro.In[tz.UTC](coffeeBrew.UpdatedAt))
		})
	}
	// Only Other
	var stock *model.Stock
	if product.Stock != nil {
		stock = model.ReconstructStock(product.StockId, product.Stock.Name, int32(product.Stock.Quantity), synchro.In[tz.UTC](product.Stock.CreatedAt), synchro.In[tz.UTC](product.Stock.UpdatedAt))
	}

	return model.ReconstructProduct(
		product.ID,
		*model.ReconstructProductName(product.Name),
		*productCategory,
		model.ProductType(product.ProductType),
		product.Color,
		product.IsNowSales,
		synchro.In[tz.UTC](product.CreatedAt),
		synchro.In[tz.UTC](product.UpdatedAt),
		coffeeBean,
		productCoffeeBrews,
		uint64(product.Amount),
		stock,
	)
}

func (i *productQueryServiceDb) FindAll(ctx context.Context) ([]*model.Product, error) {
	daoProducts := make([]dao.Product, 0)
	if err := i.db.NewSelect().Model(&daoProducts).Column("product.*").Relation("Category").Relation("CoffeeBean").Relation("Stock").Relation("CoffeeBrews").Order("id ASC").Scan(ctx); err != nil {
		return nil, err
	}

	return lo.Map(daoProducts, func(daoProduct dao.Product, _ int) *model.Product {
		return toProduct(&daoProduct)
	}), nil
}

func (i *productQueryServiceDb) FindById(ctx context.Context, id string) (*model.Product, error) {
	daoProduct := new(dao.Product)
	if err := i.db.NewSelect().Model(daoProduct).
		Column("product.*").
		Relation("Category").
		Relation("CoffeeBean").
		Relation("Stock").
		Relation("CoffeeBrews").Where("product.id = ?", id).Scan(ctx); err != nil {
		return nil, err
	}

	return toProduct(daoProduct), nil
}
