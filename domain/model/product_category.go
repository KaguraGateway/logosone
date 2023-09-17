package model

import (
	"github.com/KaguraGateway/cafelogos-pos-backend/domain"
	"github.com/oklog/ulid/v2"
)

type ProductCategory struct {
	id   string
	name string
}

func NewProductCategory(name string) (*ProductCategory, error) {
	pc := &ProductCategory{
		id: ulid.Make().String(),
	}
	if err := pc.SetName(name); err != nil {
		return nil, err
	}
	return pc, nil
}

func ReconstructProductCategory(id string, name string) *ProductCategory {
	return &ProductCategory{
		id:   id,
		name: name,
	}
}

func (productCategory *ProductCategory) GetId() string {
	return productCategory.id
}

func (productCategory *ProductCategory) GetName() string {
	return productCategory.name
}

func (productCategory *ProductCategory) SetName(name string) error {
	if len(name) == 0 {
		return domain.ErrProductCategoryNameInvalid
	}
	productCategory.name = name
	return nil
}
