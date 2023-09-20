package repository

import "github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"

type OrderRepository interface {
	FindById(id string) (*model.Order, error)
	Save(order *model.Order) error
}
