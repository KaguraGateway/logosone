package order

import (
	"github.com/KaguraGateway/cafelogos-pos-backend/domain"
	"github.com/google/uuid"
)

type Discount struct {
	id            uuid.UUID
	name          string
	discountType  DiscountType
	discountPrice uint64
}

func NewDiscount(name string, discountType DiscountType, discountPrice uint64) (*Discount, error) {
	discount := &Discount{
		id:            uuid.UUID{},
		discountType:  discountType,
		discountPrice: discountPrice,
	}
	if err := discount.SetName(name); err != nil {
		return nil, err
	}
	return discount, nil
}

func ReconstructDiscount(id uuid.UUID, name string, discountType DiscountType, discountPrice uint64) *Discount {
	return &Discount{
		id:            id,
		name:          name,
		discountType:  discountType,
		discountPrice: discountPrice,
	}
}

func (discount *Discount) GetId() uuid.UUID {
	return discount.id
}

func (discount *Discount) GetName() string {
	return discount.name
}

func (discount *Discount) SetName(name string) error {
	if len(name) == 0 {
		return domain.ErrDiscountNameInvalid
	}
	discount.name = name
	return nil
}

func (discount *Discount) GetDiscountType() DiscountType {
	return discount.discountType
}

func (discount *Discount) GetDiscountPrice() uint64 {
	return discount.discountPrice
}

func (discount *Discount) SetDiscountType(discountType DiscountType) {
	discount.discountType = discountType
}

func (discount *Discount) SetDiscountPrice(discountPrice uint64) {
	discount.discountPrice = discountPrice
}

type DiscountRepository interface {
	FindById(id uuid.UUID) (*Discount, error)
	FindAll() ([]*Discount, error)
}
