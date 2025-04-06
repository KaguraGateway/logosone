package domain_service

import (
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/samber/lo"
)

func GetTotalAmount(orders []*model.Order) int64 {
	return lo.Reduce(orders, func(agg int64, item *model.Order, index int) int64 {
		return agg + int64(item.GetTotalAmount())
	}, int64(0))
}

func IsEnoughAmount(payment *model.Payment, orders []*model.Order) bool {
	totalAmount := GetTotalAmount(orders)
	return payment.ReceiveAmount >= totalAmount
}
