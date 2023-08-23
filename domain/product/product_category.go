package product

import (
	"github.com/KaguraGateway/cafelogos-pos-backend/domain"
	"github.com/google/uuid"
)

type ProductCategory struct {
	id   uuid.UUID
	name string
}

func NewProductCategory(name string) (error, *ProductCategory) {
	pc := &ProductCategory{
		id: uuid.UUID{},
	}
	if err := pc.SetName(name); err != nil {
		return err, nil
	}
	return nil, pc
}

func ReconstructProductCategory(id uuid.UUID, name string) *ProductCategory {
	return &ProductCategory{
		id:   id,
		name: name,
	}
}

func (productCategory *ProductCategory) GetId() uuid.UUID {
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
