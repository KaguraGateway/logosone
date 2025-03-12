package application

import (
	"context"
	"time"

	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
)

type SalesQueryService interface {
	// 日別売上を取得
	FindDailySales(ctx context.Context, startDate, endDate time.Time) ([]*pos.DailySale, error)
	
	// 商品別売上を取得
	FindProductSales(ctx context.Context, startDate, endDate time.Time) ([]*pos.ProductSale, error)
	
	// 時間帯別売上を取得
	FindSalesByTimeSlot(ctx context.Context, date time.Time) ([]*pos.TimeSlotSale, error)
	
	// 支払い方法別売上を取得
	FindSalesByPaymentType(ctx context.Context, startDate, endDate time.Time) ([]*pos.PaymentTypeSale, error)
}
