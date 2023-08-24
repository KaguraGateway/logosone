package domain

import "errors"

var ErrProductNameInvalid = errors.New("product name is invalid")
var ErrProductCategoryNameInvalid = errors.New(("product category name is invalid"))
var ErrCoffeeBeanNameInvalid = errors.New(("coffee bean name is invalid"))
var ErrCoffeeHowToBrewNameInvalid = errors.New(("coffee brew name is invalid"))
var ErrStockNameInvalid = errors.New(("stock name is invalid"))
var ErrProductUnsettledAmount = errors.New(("product unsettled amount"))
var ErrProductNotCoffee = errors.New(("product is not coffee"))
var ErrCoffeeHowToBrewNotFound = errors.New(("coffee brew not exists"))
var ErrCartItemInvalid = errors.New(("cart item is invalid"))
var ErrDiscountNameInvalid = errors.New(("discount name is invalid"))
var ErrPaymentNotEnought = errors.New(("payment is not enought"))
