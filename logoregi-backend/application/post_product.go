package application

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/cockroachdb/errors"
	"github.com/samber/do"
)

type PostProduct interface {
	Execute(ctx context.Context, param *ProductParam) error
}

type postProductUseCase struct {
	productRepo         repository.ProductRepository
	productCategoryRepo repository.ProductCategoryRepository
	coffeeBeanRepo      repository.CoffeeBeanRepository
	coffeeBrewRepo      repository.ProductCoffeeBrewRepository
	stockRepo           repository.StockRepository
}

func NewPostProductUseCase(i *do.Injector) (PostProduct, error) {
	return &postProductUseCase{
		productRepo:         do.MustInvoke[repository.ProductRepository](i),
		productCategoryRepo: do.MustInvoke[repository.ProductCategoryRepository](i),
		coffeeBeanRepo:      do.MustInvoke[repository.CoffeeBeanRepository](i),
		coffeeBrewRepo:      do.MustInvoke[repository.ProductCoffeeBrewRepository](i),
		stockRepo:           do.MustInvoke[repository.StockRepository](i),
	}, nil
}

func (uc *postProductUseCase) Execute(ctx context.Context, param *ProductParam) error {
	cctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	productName, err := model.NewProductName(param.ProductName)
	if err != nil {
		return errors.Join(err, ErrInvalidParam)
	}
	productCategory, err := uc.productCategoryRepo.FindById(cctx, param.ProductCategoryId)
	if err != nil {
		return errors.Join(err, ErrFailedFetchProductCategory)
	}
	productType := model.ProductType(param.ProductType)

	var product model.Product
	if productType == model.ProductType(model.Coffee) {
		coffeeBean, err := uc.coffeeBeanRepo.FindById(cctx, param.CoffeeBeanId)
		if err != nil {
			return errors.Join(err, ErrFailedFetchCoffeeBean)
		}
		var coffeeBrews []*model.ProductCoffeeBrew

		// 先にproductを作成しておかないと、brewのproduct_idが空になってしまう
		product = *model.NewProductCoffee(*productName, *productCategory, param.Color, param.IsNowSales, *coffeeBean, coffeeBrews, param.IsManagingOrder, param.IsOlUseKitchen)

		for _, pBrew := range param.CoffeeBrews {
			brew, err := model.NewProductCoffeeBrew(product.GetId(), pBrew.Name, pBrew.BeanQuantityGrams, pBrew.Amount)
			if err != nil {
				return errors.Join(err, ErrInvalidParam)
			}
			coffeeBrews = append(coffeeBrews, brew)
		}
		for _, brew := range coffeeBrews {
			if err := uc.coffeeBrewRepo.Save(cctx, brew); err != nil {
				return err
			}
		}
	} else {
		stock, err := uc.stockRepo.FindById(cctx, param.StockId)
		if err != nil {
			return errors.Join(err, ErrFailedFetchStock)
		}
		product = *model.NewProductOther(*productName, *productCategory, param.Color, param.IsNowSales, param.Amount, *stock, param.IsManagingOrder, param.IsOlUseKitchen)
	}

	if err := uc.productRepo.Save(cctx, &product); err != nil {
		return err
	}

	return nil
}
