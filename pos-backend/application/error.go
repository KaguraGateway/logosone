package application

import "github.com/cockroachdb/errors"

var ErrInvalidParam = errors.New("invalid product param")
var ErrFailedFetchStock = errors.New("failed to fetch stock")
var ErrFailedFetchProductCategory = errors.New("failed to fetch product category")
var ErrFailedFetchCoffeeBean = errors.New("failed to fetch coffee bean")
var ErrDiscountPriceDiff = errors.New("Discount price entered differs from the discount price in the database")
var ErrProductAmountDiff = errors.New("Product amount entered differs from the product amount in the database")
var ErrPaymentAmountDiff = errors.New("payment amount diff")
var ErrPaymentChangeAmountDiff = errors.New("Wrong change.")
var ErrPaymentNotEnough = errors.New("Payment not enough")
var ErrProductStockShortage = errors.New("Product stock shortage")
