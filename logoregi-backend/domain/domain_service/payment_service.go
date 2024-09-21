package domain_service

import (
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/samber/lo"
)

func GetTotalAmount(orders []*model.Order) uint64 {
	return lo.Reduce(orders, func(agg uint64, item *model.Order, index int) uint64 {
		return agg + item.GetTotalAmount()
	}, uint64(0))
}

func IsEnoughAmount(payment *model.Payment, orders []*model.Order) bool {
	totalAmount := GetTotalAmount(orders)
	return payment.ReceiveAmount >= totalAmount
}
