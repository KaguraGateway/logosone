package bundb

import (
	"context"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/KaguraGateway/logosone/logoregi-backend/infra/bundb/dao"
	"github.com/oklog/ulid/v2"
	"github.com/samber/do"
	"github.com/samber/lo"
	"github.com/uptrace/bun"
)

type paymentDb struct {
	db *bun.DB
}

func NewPaymentDb(i *do.Injector) (repository.PaymentRepository, error) {
	return &paymentDb{db: do.MustInvoke[*bun.DB](i)}, nil
}

func toPayment(daoPayment *dao.Payment) *model.Payment {
	return model.ReconstructPayment(
		daoPayment.ID,
		lo.Map(daoPayment.OrderPayments, func(item *dao.OrderPayment, index int) string {
			return item.OrderID
		}),
		model.PaymentType(daoPayment.PaymentType),
		daoPayment.ReceiveAmount,
		daoPayment.PaymentAmount,
		synchro.In[tz.UTC](daoPayment.PaymentAt),
		synchro.In[tz.UTC](daoPayment.UpdatedAt),
	)
}

func paymentRelationQuery(q *bun.SelectQuery) *bun.SelectQuery {
	return q.
		Relation("OrderPayments").
		Relation("Order")
}

func (i *paymentDb) FindById(ctx context.Context, id string) (*model.Payment, error) {
	daoPayment := new(dao.Payment)
	if err := paymentRelationQuery(i.db.NewSelect().Model(daoPayment).Where("id = ?", id)).Scan(ctx); err != nil {
		return nil, err
	}
	return toPayment(daoPayment), nil
}

func toDaoPayment(payment *model.Payment) *dao.Payment {
	return &dao.Payment{
		ID: payment.GetId(),
		OrderPayments: lo.Map(payment.GetOrderIds(), func(item string, index int) *dao.OrderPayment {
			return &dao.OrderPayment{
				ID:        ulid.Make().String(),
				OrderID:   item,
				PaymentID: payment.GetId(),
			}
		}),
		PaymentType:   uint(payment.GetPaymentType()),
		ReceiveAmount: payment.ReceiveAmount,
		PaymentAmount: payment.PaymentAmount,
		ChangeAmount:  payment.GetChangeAmount(),
		PaymentAt:     payment.GetPaymentAt().StdTime(),
		UpdatedAt:     payment.GetUpdatedAt().StdTime(),
	}
}

func orderPaymentInsertQuery(q *bun.InsertQuery) *bun.InsertQuery {
	return q.On("CONFLICT (id) DO UPDATE").Set("payment_type = EXCLUDED.payment_type").Set("receive_amount = EXCLUDED.receive_amount").Set("payment_amount = EXCLUDED.payment_amount").Set("change_amount = EXCLUDED.change_amount")
}

func (i *paymentDb) Save(ctx context.Context, payment *model.Payment) error {
	daoPayment := toDaoPayment(payment)
	if _, err := orderPaymentInsertQuery(i.db.NewInsert().Model(daoPayment)).Exec(ctx); err != nil {
		return err
	}

	for _, item := range daoPayment.OrderPayments {
		daoOrderPayment := &dao.OrderPayment{
			ID:        item.ID,
			OrderID:   item.OrderID,
			PaymentID: item.PaymentID,
		}
		if _, err := i.db.NewInsert().Model(daoOrderPayment).Ignore().Exec(ctx); err != nil {
			return err
		}
	}

	return nil
}

func (i *paymentDb) SaveTx(ctx context.Context, tx interface{}, payment *model.Payment) error {
	bunTx := tx.(bun.Tx)
	daoPayment := toDaoPayment(payment)
	if _, err := orderPaymentInsertQuery(bunTx.NewInsert().Model(daoPayment)).Exec(ctx); err != nil {
		return err
	}
	for _, item := range daoPayment.OrderPayments {
		daoOrderPayment := &dao.OrderPayment{
			ID:        item.ID,
			OrderID:   item.OrderID,
			PaymentID: item.PaymentID,
		}
		if _, err := bunTx.NewInsert().Model(daoOrderPayment).Ignore().Exec(ctx); err != nil {
			return err
		}
	}
	return nil
}
