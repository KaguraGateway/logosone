package model

import (
	"github.com/KaguraGateway/logosone/logoregi-backend/domain"
	"github.com/oklog/ulid/v2"
)

type Discount struct {
	id            string
	name          string
	discountType  DiscountType
	discountPrice uint64
}

func NewDiscount(name string, discountType DiscountType, discountPrice uint64) (*Discount, error) {
	if len(name) == 0 {
		return nil, domain.ErrDiscountNameInvalid
	}
	discount := &Discount{
		id:            ulid.Make().String(),
		name:          name,
		discountType:  discountType,
		discountPrice: discountPrice,
	}
	return discount, nil
}

func ReconstructDiscount(id string, name string, discountType DiscountType, discountPrice uint64) *Discount {
	return &Discount{
		id:            id,
		name:          name,
		discountType:  discountType,
		discountPrice: discountPrice,
	}
}

func (discount *Discount) GetId() string {
	return discount.id
}

func (discount *Discount) GetName() string {
	return discount.name
}

func (discount *Discount) GetDiscountType() DiscountType {
	return discount.discountType
}

func (discount *Discount) GetDiscountPrice() uint64 {
	return discount.discountPrice
}
