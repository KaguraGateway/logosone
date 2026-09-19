package bundb

import (
	"context"
	"time"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain"
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
	var canceledAt *synchro.Time[tz.UTC]
	if daoPayment.CanceledAt != nil {
		t := synchro.In[tz.UTC](*daoPayment.CanceledAt)
		canceledAt = &t
	}
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
		canceledAt,
	)
}

func paymentRelationQuery(q *bun.SelectQuery) *bun.SelectQuery {
	return q.
		Relation("OrderPayments").
		Relation("OrderPayments.Order")
}

func (i *paymentDb) FindById(ctx context.Context, id string) (*model.Payment, error) {
	daoPayment := new(dao.Payment)
	if err := paymentRelationQuery(i.db.NewSelect().Model(daoPayment).Where("id = ?", id)).Scan(ctx); err != nil {
		return nil, err
	}
	return toPayment(daoPayment), nil
}

func toDaoPayment(payment *model.Payment) *dao.Payment {
	var canceledAt *time.Time
	if payment.GetCanceledAt() != nil {
		t := payment.GetCanceledAt().StdTime()
		canceledAt = &t
	}
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
		CanceledAt:    canceledAt,
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

// Cancel 決済を取消済みとして記録する（レコードは物理削除しない）
func (i *paymentDb) Cancel(ctx context.Context, payment *model.Payment) error {
	daoPayment := toDaoPayment(payment)
	res, err := i.db.NewUpdate().
		Model(daoPayment).
		Column("canceled_at", "updated_at").
		WherePK().
		Where("canceled_at IS NULL").
		Exec(ctx)
	if err != nil {
		return err
	}
	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return domain.ErrPaymentAlreadyCanceled
	}
	return nil
}
