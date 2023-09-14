package application

import (
	"context"

	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/cockroachdb/errors"
	"github.com/samber/do"
)

type PostProduct interface {
	Execute(param ProductParam) error
}

type postProductUseCase struct {
	ctx                 context.Context
	productRepo         repository.ProductRepository
	productCategoryRepo repository.ProductCategoryRepository
	coffeeBeanRepo      repository.CoffeeBeanRepository
	coffeeBrewRepo      repository.ProductCoffeeBrewRepository
	stockRepo           repository.StockRepository
}

func NewPostProductUseCase(i *do.Injector) *postProductUseCase {
	return &postProductUseCase{
		ctx:                 do.MustInvoke[context.Context](i),
		productRepo:         do.MustInvoke[repository.ProductRepository](i),
		productCategoryRepo: do.MustInvoke[repository.ProductCategoryRepository](i),
		coffeeBeanRepo:      do.MustInvoke[repository.CoffeeBeanRepository](i),
		coffeeBrewRepo:      do.MustInvoke[repository.ProductCoffeeBrewRepository](i),
		stockRepo: do.MustInvoke[repository.StockRepository](i),
	}
}

func (uc *postProductUseCase) Execute(param ProductParam) error {
	ctx, cancel := context.WithTimeout(uc.ctx, CtxTimeoutDur)
	defer cancel()

	productName, err := model.NewProductName(param.ProductName)
	if err != nil {
		return errors.Join(err, ErrInvalidParam)
	}
	productCategory, err := uc.productCategoryRepo.FindById(ctx, param.ProductCategoryId)
	if err != nil {
		return errors.Join(err, ErrInvalidParam)
	}
	productType := model.ProductType(param.ProductType)

	var product model.Product
	if productType == model.ProductType(model.Coffee) {
		coffeeBean, err := uc.coffeeBeanRepo.FindById(ctx, param.CoffeeBeanId)
		if err != nil {
			return errors.Join(err, ErrInvalidParam)
		}
		var coffeeBrews []*model.ProductCoffeeBrew
		for _, pBrew := range param.CoffeeBrews {
			brew, err := model.NewProductCoffeeBrew(product.GetId(), pBrew.Name, pBrew.BeanQuantityGrams, pBrew.Amount)
			if err != nil {
				return errors.Join(err, ErrInvalidParam)
			}
			coffeeBrews = append(coffeeBrews, brew)
		}
		for _, brew := range coffeeBrews {
			if err := uc.coffeeBrewRepo.Save(ctx, brew); err != nil {
				return err
			}
		}

		product = *model.NewProductCoffee(*productName, *productCategory, param.IsNowSales, *coffeeBean, coffeeBrews)
	} else {
		stock, err := uc.stockRepo.FindById(ctx, param.StockId)
		if err != nil {
			return errors.Join(err, ErrInvalidParam)
		}
		product = *model.NewProductOther(*productName, *productCategory, param.IsNowSales, param.Amount, *stock)
	}

	if err := uc.productRepo.Save(ctx, &product); err != nil {
		return err
	}

	return nil
}
