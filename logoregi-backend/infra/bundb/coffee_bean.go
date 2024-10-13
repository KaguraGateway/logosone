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

type coffeeBeanDb struct {
	db *bun.DB
}

func NewCoffeeBeanDb(i *do.Injector) (repository.CoffeeBeanRepository, error) {
	return &coffeeBeanDb{db: do.MustInvoke[*bun.DB](i)}, nil
}

func toCoffeeBean(daoCoffeeBean dao.CoffeeBean) *model.CoffeeBean {
	return model.ReconstructCoffeeBean(daoCoffeeBean.ID, daoCoffeeBean.Name, daoCoffeeBean.GramQuantity, synchro.In[tz.UTC](daoCoffeeBean.CreatedAt), synchro.In[tz.UTC](daoCoffeeBean.UpdatedAt))
}

func (i *coffeeBeanDb) FindAll(ctx context.Context) ([]*model.CoffeeBean, error) {
	daoCoffeeBeans := make([]dao.CoffeeBean, 0)
	if err := i.db.NewSelect().Model(&daoCoffeeBeans).Scan(ctx); err != nil {
		return nil, err
	}
	coffeeBeans := lo.Map(daoCoffeeBeans, func(daoCoffeeBean dao.CoffeeBean, _ int) *model.CoffeeBean {
		return toCoffeeBean(daoCoffeeBean)
	})
	return coffeeBeans, nil
}

func (i *coffeeBeanDb) FindById(ctx context.Context, id string) (*model.CoffeeBean, error) {
	daoCoffeeBean := new(dao.CoffeeBean)
	if err := i.db.NewSelect().Model(daoCoffeeBean).Where("id = ?", id).Scan(ctx); err != nil {
		return nil, err
	}
	return toCoffeeBean(*daoCoffeeBean), nil
}

func (i *coffeeBeanDb) Save(ctx context.Context, coffeeBean *model.CoffeeBean) error {
	daoCoffeeBean := &dao.CoffeeBean{
		ID:           coffeeBean.GetId(),
		Name:         coffeeBean.GetName(),
		GramQuantity: coffeeBean.GramQuantity,
		CreatedAt:    coffeeBean.GetCreatedAt().StdTime(),
		UpdatedAt:    coffeeBean.GetUpdatedAt().StdTime(),
	}
	if _, err := i.db.NewInsert().Model(daoCoffeeBean).On("CONFLICT (id) DO UPDATE").Set("name = EXCLUDED.name").Set("gram_quantity = EXCLUDED.gram_quantity").Exec(ctx); err != nil {
		return err
	}
	return nil
}
