package application

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/samber/do"
)

type CancelPayment interface {
	Execute(ctx context.Context, paymentId string) error
}

type cancelPaymentUseCase struct {
	paymentRepo repository.PaymentRepository
	orderQS     OrderQueryService
	productQS   ProductQueryService
	stockRepo   repository.StockRepository
	txRepo      repository.TxRepository
}

func NewCancelPaymentUseCase(i *do.Injector) (CancelPayment, error) {
	return &cancelPaymentUseCase{
		paymentRepo: do.MustInvoke[repository.PaymentRepository](i),
		orderQS:     do.MustInvoke[OrderQueryService](i),
		productQS:   do.MustInvoke[ProductQueryService](i),
		stockRepo:   do.MustInvoke[repository.StockRepository](i),
		txRepo:      do.MustInvoke[repository.TxRepository](i),
	}, nil
}

// Execute 決済を取消済みにする。注文データは監査のため削除せず残し、売上集計からのみ除外される。
// 注文時に減らした在庫は、取り消した数量だけ戻す。
func (uc *cancelPaymentUseCase) Execute(ctx context.Context, paymentId string) error {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	if len(paymentId) == 0 {
		return ErrInvalidParam
	}

	payment, err := uc.paymentRepo.FindById(ctx, paymentId)
	if err != nil {
		return err
	}
	if err := payment.Cancel(); err != nil {
		return err
	}

	restoreStocks, err := uc.collectRestoreStocks(ctx, payment)
	if err != nil {
		return err
	}

	return uc.txRepo.Transaction(ctx, func(ctx context.Context, tx interface{}) error {
		if err := uc.paymentRepo.CancelTx(ctx, tx, payment); err != nil {
			return err
		}
		for _, stock := range restoreStocks {
			if err := uc.stockRepo.SaveTx(ctx, tx, stock); err != nil {
				return err
			}
		}
		return nil
	})
}

// collectRestoreStocks 取消対象の注文から、戻すべき在庫を集める。
// PostOrderが在庫を減らすのはコーヒー以外かつ在庫を持つ商品だけなので、戻すのも同じ条件に限る。
// 複数の明細が同じ在庫を参照する場合があるため、在庫IDごとに数量を合算する。
func (uc *cancelPaymentUseCase) collectRestoreStocks(ctx context.Context, payment *model.Payment) ([]*model.Stock, error) {
	stocks := make(map[string]*model.Stock)
	order := make([]string, 0)

	for _, orderId := range payment.GetOrderIds() {
		o, err := uc.orderQS.FindById(ctx, orderId)
		if err != nil {
			return nil, err
		}
		for _, item := range o.GetOrderItems() {
			brew := item.GetCoffeeHowToBrew()
			if len(brew.GetId()) != 0 {
				continue
			}
			product, err := uc.productQS.FindById(ctx, item.GetProductId())
			if err != nil {
				return nil, err
			}
			if product.Stock == nil {
				continue
			}
			stock, ok := stocks[product.Stock.GetId()]
			if !ok {
				stock = product.Stock
				stocks[stock.GetId()] = stock
				order = append(order, stock.GetId())
			}
			stock.Quantity = stock.Quantity + int32(item.Quantity)
		}
	}

	restoreStocks := make([]*model.Stock, 0, len(order))
	for _, id := range order {
		restoreStocks = append(restoreStocks, stocks[id])
	}
	return restoreStocks, nil
}
