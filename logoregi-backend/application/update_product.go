package application

import (
	"context"
	"log"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/cockroachdb/errors"
	"github.com/samber/do"
	"github.com/samber/lo"
)

type UpdateProduct interface {
	Execute(ctx context.Context, id string, param *ProductParam) error
}

type updateProductUseCase struct {
	productRepo         repository.ProductRepository
	productQueryService ProductQueryService
	productCategoryRepo repository.ProductCategoryRepository
	coffeeBeanRepo      repository.CoffeeBeanRepository
	coffeeBrewRepo      repository.ProductCoffeeBrewRepository
	stockRepo           repository.StockRepository
}

func NewUpdateProductUseCase(i *do.Injector) (UpdateProduct, error) {
	return &updateProductUseCase{
		productRepo:         do.MustInvoke[repository.ProductRepository](i),
		productQueryService: do.MustInvoke[ProductQueryService](i),
		productCategoryRepo: do.MustInvoke[repository.ProductCategoryRepository](i),
		coffeeBeanRepo:      do.MustInvoke[repository.CoffeeBeanRepository](i),
		coffeeBrewRepo:      do.MustInvoke[repository.ProductCoffeeBrewRepository](i),
		stockRepo:           do.MustInvoke[repository.StockRepository](i),
	}, nil
}

func (uc *updateProductUseCase) Execute(ctx context.Context, id string, param *ProductParam) error {
	cctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	product, err := uc.productQueryService.FindById(cctx, id)
	if err != nil {
		log.Printf("%v", err)
		return err
	}

	if len(param.ProductName) != 0 {
		if err := product.ProductName.Set(param.ProductName); err != nil {
			return errors.Join(err, ErrInvalidParam)
		}
	}
	if param.ProductCategoryId != product.ProductCategory.GetId() {
		productCategory, err := uc.productCategoryRepo.FindById(cctx, param.ProductCategoryId)
		if err != nil {
			return errors.Join(err, ErrInvalidParam)
		}
		product.ProductCategory = *productCategory
	}
	if model.ProductType(param.ProductType) != product.ProductType {
		product.ProductType = model.ProductType(param.ProductType)
	}
	product.Color = param.Color
	product.IsNowSales = param.IsNowSales

	// Only Coffee
	if product.CoffeeBean != nil && param.CoffeeBeanId != product.CoffeeBean.GetId() {
		coffeeBean, err := uc.coffeeBeanRepo.FindById(cctx, param.CoffeeBeanId)
		if err != nil {
			return errors.Join(err, ErrInvalidParam)
		}
		product.CoffeeBean = coffeeBean
	}
	if model.ProductType(param.ProductType) == model.ProductType(model.Coffee) && param.CoffeeBrews != nil {
		// New
		newBrews := lo.Filter(param.CoffeeBrews, func(pBrew CoffeeBrewParam, _ int) bool {
			if len(pBrew.Id) == 0 {
				return true
			}
			return false
		})
		for _, pBrew := range newBrews {
			brew, err := model.NewProductCoffeeBrew(product.GetId(), pBrew.Name, pBrew.BeanQuantityGrams, pBrew.Amount)
			if err != nil {
				return errors.Join(err, ErrInvalidParam)
			}
			if err := uc.coffeeBrewRepo.Save(cctx, brew); err != nil {
				return err
			}
		}
		// Diff
		diffBrews := lo.Filter(param.CoffeeBrews, func(pBrew CoffeeBrewParam, _ int) bool {
			for _, brew := range product.CoffeeBrews {
				if pBrew.Id == brew.GetId() && (pBrew.Name != brew.GetName() || pBrew.BeanQuantityGrams != brew.BeanQuantityGrams || pBrew.Amount != brew.Amount) {
					return true
				}
			}
			return false
		})
		for _, pBrew := range diffBrews {
			brew, err := uc.coffeeBrewRepo.FindById(cctx, pBrew.Id)
			if err != nil {
				return errors.Join(err, ErrInvalidParam)
			}
			if err := brew.SetName(pBrew.Name); err != nil {
				return errors.Join(err, ErrInvalidParam)
			}
			brew.BeanQuantityGrams = pBrew.BeanQuantityGrams
			brew.Amount = pBrew.Amount
			if err := uc.coffeeBrewRepo.Save(cctx, brew); err != nil {
				return err
			}
		}
		// Remove
		removedBrews := lo.Filter(product.CoffeeBrews, func(brew *model.ProductCoffeeBrew, _ int) bool {
			for _, pBrew := range param.CoffeeBrews {
				if brew.GetId() == pBrew.Id {
					return false
				}
			}
			return true
		})
		for _, brew := range removedBrews {
			if err := uc.coffeeBrewRepo.Delete(cctx, brew.GetId()); err != nil {
				return err
			}
		}
	}

	// Only Other
	if param.Amount != 0 {
		product.SetAmount(param.Amount)
	}
	if model.ProductType(param.ProductType) == model.ProductType(model.Other) && param.StockId != product.Stock.GetId() {
		stock, err := uc.stockRepo.FindById(cctx, param.StockId)
		if err != nil {
			return errors.Join(err, ErrInvalidParam)
		}
		product.Stock = stock
	}

	if err := uc.productRepo.Save(cctx, product); err != nil {
		return err
	}

	return nil
}
