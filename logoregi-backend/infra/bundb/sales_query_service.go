package bundb

import (
	"context"
	"fmt"
	"time"

	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/samber/do"
	"github.com/uptrace/bun"
)

type salesQueryServiceDb struct {
	db *bun.DB
}

func NewSalesQueryServiceDb(i *do.Injector) (application.SalesQueryService, error) {
	return &salesQueryServiceDb{db: do.MustInvoke[*bun.DB](i)}, nil
}

// 日別売上を取得
func (i *salesQueryServiceDb) FindDailySales(ctx context.Context, startDate, endDate time.Time) ([]*pos.DailySale, error) {
	var results []struct {
		Date          time.Time `bun:"date"`
		TotalSales    uint64    `bun:"total_sales"`
		TotalQuantity uint64    `bun:"total_quantity"`
	}

	err := i.db.NewRaw(`
		SELECT 
			DATE(p.payment_at) as date,
			SUM(p.payment_amount) as total_sales,
			SUM(
				(SELECT SUM(oi.quantity) FROM order_items oi WHERE oi.order_id = op.order_id)
			) as total_quantity
		FROM 
			payments p
		JOIN 
			order_payments op ON p.id = op.payment_id
		WHERE 
			DATE(p.payment_at) BETWEEN ? AND ?
		GROUP BY 
			DATE(p.payment_at)
		ORDER BY 
			date
	`, startDate.Format("2006-01-02"), endDate.Format("2006-01-02")).Scan(ctx, &results)

	if err != nil {
		return nil, err
	}

	dailySales := make([]*pos.DailySale, 0, len(results))
	for _, result := range results {
		dailySales = append(dailySales, &pos.DailySale{
			Date:          result.Date.Format("2006-01-02"),
			TotalSales:    result.TotalSales,
			TotalQuantity: result.TotalQuantity,
		})
	}

	return dailySales, nil
}

// 商品別売上を取得
func (i *salesQueryServiceDb) FindProductSales(ctx context.Context, startDate, endDate time.Time) ([]*pos.ProductSale, error) {
	var results []struct {
		ProductId      string  `bun:"product_id"`
		ProductName    string  `bun:"product_name"`
		TotalSales     uint64  `bun:"total_sales"`
		TotalQuantity  uint64  `bun:"total_quantity"`
		CoffeeBrewId   *string `bun:"coffee_brew_id"`
		CoffeeBrewName *string `bun:"coffee_brew_name"`
	}

	err := i.db.NewRaw(`
		SELECT 
			p.id as product_id,
			p.product_name,
			SUM(oi.amount * oi.quantity) as total_sales,
			SUM(oi.quantity) as total_quantity,
			pcb.id as coffee_brew_id,
			pcb.name as coffee_brew_name
		FROM 
			order_items oi
		JOIN 
			products p ON oi.product_id = p.id
		LEFT JOIN 
			product_coffee_brews pcb ON oi.coffee_brew_id = pcb.id
		JOIN 
			orders o ON oi.order_id = o.id
		JOIN 
			order_payments op ON o.id = op.order_id
		JOIN 
			payments pay ON op.payment_id = pay.id
		WHERE 
			DATE(pay.payment_at) BETWEEN ? AND ?
		GROUP BY 
			p.id, p.product_name, pcb.id, pcb.name
		ORDER BY 
			total_sales DESC
	`, startDate.Format("2006-01-02"), endDate.Format("2006-01-02")).Scan(ctx, &results)

	if err != nil {
		return nil, err
	}

	productSales := make([]*pos.ProductSale, 0, len(results))
	for _, result := range results {
		productSale := &pos.ProductSale{
			ProductId:     result.ProductId,
			ProductName:   result.ProductName,
			TotalSales:    result.TotalSales,
			TotalQuantity: result.TotalQuantity,
		}
		
		if result.CoffeeBrewId != nil {
			productSale.CoffeeBrewId = *result.CoffeeBrewId
		}
		if result.CoffeeBrewName != nil {
			productSale.CoffeeBrewName = *result.CoffeeBrewName
		}
		
		productSales = append(productSales, productSale)
	}

	return productSales, nil
}

// 時間帯別売上を取得
func (i *salesQueryServiceDb) FindSalesByTimeSlot(ctx context.Context, date time.Time) ([]*pos.TimeSlotSale, error) {
	var results []struct {
		Hour          int    `bun:"hour"`
		Minute        int    `bun:"minute"`
		TotalSales    uint64 `bun:"total_sales"`
		TotalQuantity uint64 `bun:"total_quantity"`
	}

	err := i.db.NewRaw(`
		SELECT 
			EXTRACT(HOUR FROM p.payment_at) as hour,
			FLOOR(EXTRACT(MINUTE FROM p.payment_at) / 30) * 30 as minute,
			SUM(p.payment_amount) as total_sales,
			SUM(
				(SELECT SUM(oi.quantity) FROM order_items oi WHERE oi.order_id = op.order_id)
			) as total_quantity
		FROM 
			payments p
		JOIN 
			order_payments op ON p.id = op.payment_id
		WHERE 
			DATE(p.payment_at) = ?
		GROUP BY 
			hour, minute
		ORDER BY 
			hour, minute
	`, date.Format("2006-01-02")).Scan(ctx, &results)

	if err != nil {
		return nil, err
	}

	timeSlotSales := make([]*pos.TimeSlotSale, 0, len(results))
	for _, result := range results {
		timeSlot := fmt.Sprintf("%02d:%02d-%02d:%02d", 
			result.Hour, result.Minute, 
			result.Hour + (result.Minute+30)/60, (result.Minute+30)%60)
		
		timeSlotSales = append(timeSlotSales, &pos.TimeSlotSale{
			TimeSlot:      timeSlot,
			TotalSales:    result.TotalSales,
			TotalQuantity: result.TotalQuantity,
		})
	}

	return timeSlotSales, nil
}

// 支払い方法別売上を取得
func (i *salesQueryServiceDb) FindSalesByPaymentType(ctx context.Context, startDate, endDate time.Time) ([]*pos.PaymentTypeSale, error) {
	var results []struct {
		PaymentType   int    `bun:"payment_type"`
		TotalSales    uint64 `bun:"total_sales"`
		TotalQuantity uint64 `bun:"total_quantity"`
	}

	err := i.db.NewRaw(`
		SELECT 
			p.payment_type,
			SUM(p.payment_amount) as total_sales,
			SUM(
				(SELECT SUM(oi.quantity) FROM order_items oi WHERE oi.order_id = op.order_id)
			) as total_quantity
		FROM 
			payments p
		JOIN 
			order_payments op ON p.id = op.payment_id
		WHERE 
			DATE(p.payment_at) BETWEEN ? AND ?
		GROUP BY 
			p.payment_type
		ORDER BY 
			p.payment_type
	`, startDate.Format("2006-01-02"), endDate.Format("2006-01-02")).Scan(ctx, &results)

	if err != nil {
		return nil, err
	}

	paymentTypeSales := make([]*pos.PaymentTypeSale, 0, len(results))
	for _, result := range results {
		paymentTypeSales = append(paymentTypeSales, &pos.PaymentTypeSale{
			PaymentType:   int32(result.PaymentType),
			TotalSales:    result.TotalSales,
			TotalQuantity: result.TotalQuantity,
		})
	}

	return paymentTypeSales, nil
}
