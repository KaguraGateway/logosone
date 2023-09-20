package service

import "github.com/samber/do"

type OrderDomainService interface {
	
}

type orderDomainServiceImpl struct {}

func NewOrderDomainService(_ *do.Injector) (OrderDomainService, error) {
	return &orderDomainServiceImpl{}, nil
}

