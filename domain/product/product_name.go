package product

import "github.com/KaguraGateway/cafelogos-pos-backend/domain"

type ProductName struct {
	value string
}

func NewProductName(value string) (error, *ProductName) {
	productName := &ProductName{}
	if err := productName.Set(value); err != nil {
		return err, nil
	}
	return nil, productName
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
