package application

import "github.com/cockroachdb/errors"

var ErrInvalidParam = errors.New("invalid product param")
var ErrFailedFetchStock = errors.New("failed to fetch stock")
var ErrFailedFetchProductCategory = errors.New("failed to fetch product category")
var ErrFailedFetchCoffeeBean = errors.New("failed to fetch coffee bean")