package model

import "github.com/KaguraGateway/logosone/logoregi-backend/domain"

type ProductName struct {
	value string
}

func NewProductName(value string) (*ProductName, error) {
	productName := &ProductName{}
	if err := productName.Set(value); err != nil {
		return nil, err
	}
	return productName, nil
}

func ReconstructProductName(value string) *ProductName {
	return &ProductName{
		value: value,
	}
}

func (productName *ProductName) Set(newValue string) error {
	if len(newValue) == 0 {
		return domain.ErrProductNameInvalid
	}
	productName.value = newValue
	return nil
}

func (productName *ProductName) Get() string {
	return productName.value
}
