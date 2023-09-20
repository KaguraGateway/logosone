package repository

import "github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"

type OrderItemRepository interface {
	FindById(id string) (*model.OrderItem, error)
	Save(orderItem *model.OrderItem) error
}
