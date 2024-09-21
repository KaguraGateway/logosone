package domain

import "github.com/cockroachdb/errors"

var ErrProductNameInvalid = errors.New("product name is invalid")
var ErrProductCategoryNameInvalid = errors.New("product category name is invalid")
var ErrCoffeeBeanNameInvalid = errors.New("coffee bean name is invalid")
var ErrProductCoffeeBrewNameInvalid = errors.New("coffee brew name is invalid")
var ErrStockNameInvalid = errors.New("stock name is invalid")
var ErrProductUnsettledAmount = errors.New("product unsettled amount")
var ErrProductNotCoffee = errors.New("product is not coffee")
var ErrProductCoffeeBrewNotFound = errors.New("coffee brew not exists")
var ErrDiscountNameInvalid = errors.New("discount name is invalid")
var ErrPaymentNotEnough = errors.New("payment is not enought")
var ErrClientNameInvalid = errors.New("client name is invalid")
var ErrSeatNameInvalid = errors.New("seat name is invalid")
var ErrPaymentAmountInvalid = errors.New("payment amount is invalid")
