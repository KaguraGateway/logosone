package model

import (
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain"
	"github.com/oklog/ulid/v2"
)

type ProductCategory struct {
	id        string
	name      string
	createdAt synchro.Time[tz.UTC]
	updatedAt synchro.Time[tz.UTC]
}

func NewProductCategory(name string) (*ProductCategory, error) {
	pc := &ProductCategory{
		id:        ulid.Make().String(),
		createdAt: synchro.Now[tz.UTC](),
		updatedAt: synchro.Now[tz.UTC](),
	}
	if err := pc.SetName(name); err != nil {
		return nil, err
	}
	return pc, nil
}

func ReconstructProductCategory(id string, name string, createdAt synchro.Time[tz.UTC], updatedAt synchro.Time[tz.UTC]) *ProductCategory {
	return &ProductCategory{
		id:        id,
		name:      name,
		createdAt: createdAt,
		updatedAt: updatedAt,
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

func (productCategory *ProductCategory) GetCreatedAt() synchro.Time[tz.UTC] {
	return productCategory.createdAt
}

func (productCategory *ProductCategory) GetUpdatedAt() synchro.Time[tz.UTC] {
	return productCategory.updatedAt
}
