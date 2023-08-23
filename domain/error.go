package domain

import "errors"

var ErrProductNameInvalid = errors.New("product name is invalid")
var ErrProductCategoryNameInvalid = errors.New(("product category name is invalid"))
var ErrCoffeeBeanNameInvalid = errors.New(("coffee bean name is invalid"))
var ErrCoffeeHowToBrewNameInvalid = errors.New(("coffee brew name is invalid"))
var ErrStockNameInvalid = errors.New(("stock name is invalid"))
