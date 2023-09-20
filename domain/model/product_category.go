package model

import "github.com/KaguraGateway/cafelogos-orderlink-backend/domain"

type ProductCategory struct {
	id   string
	name string
}

func NewProductCategory(id string, name string) (*ProductCategory, error) {
	if len(id) == 0 {
		return nil, domain.ErrInvalidProductCategoryId
	} else if len(name) == 0 {
		return nil, domain.ErrInvalidProductCategoryName
	}

	return &ProductCategory{
		id:   id,
		name: name,
	}, nil
}

func RebuildProductCategory(id string, name string) *ProductCategory {
	return &ProductCategory{
		id:   id,
		name: name,
	}
}

func (p *ProductCategory) Id() string {
	return p.id
}

func (p *ProductCategory) Name() string {
	return p.name
}
