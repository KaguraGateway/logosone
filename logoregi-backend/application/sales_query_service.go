package application

import (
	"context"
	"time"

	"github.com/KaguraGateway/logosone/logoregi-backend/application/dto"
)

type SalesQueryService interface {
	// 日別売上を取得
	FindDailySales(ctx context.Context, startDate, endDate time.Time) ([]*dto.DailySaleDto, error)
	
	// 商品別売上を取得
	FindProductSales(ctx context.Context, startDate, endDate time.Time) ([]*dto.ProductSaleDto, error)
	
	// 時間帯別売上を取得
	FindSalesByTimeSlot(ctx context.Context, date time.Time) ([]*dto.TimeSlotSaleDto, error)
	
	// 支払い方法別売上を取得
	FindSalesByPaymentType(ctx context.Context, startDate, endDate time.Time) ([]*dto.PaymentTypeSaleDto, error)
}
