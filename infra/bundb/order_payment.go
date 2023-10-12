package bundb

import (
	"context"
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/KaguraGateway/cafelogos-pos-backend/infra/bundb/dao"
	"github.com/samber/do"
	"github.com/uptrace/bun"
)

type orderPaymentDb struct {
	db *bun.DB
}

func NewOrderPaymentDb(i *do.Injector) (repository.OrderPaymentRepository, error) {
	return &orderPaymentDb{db: do.MustInvoke[*bun.DB](i)}, nil
}

func toOrderPayment(daoOrderPayment *dao.OrderPayment) *model.OrderPayment {
	return model.ReconstructOrderPayment(
		daoOrderPayment.ID,
		daoOrderPayment.OrderID,
		model.PaymentType(daoOrderPayment.PaymentType),
		daoOrderPayment.ReceiveAmount,
		daoOrderPayment.PaymentAmount,
		synchro.In[tz.UTC](daoOrderPayment.PaymentAt),
		synchro.In[tz.UTC](daoOrderPayment.UpdatedAt),
	)
}

func (i *orderPaymentDb) FindById(ctx context.Context, id string) (*model.OrderPayment, error) {
	daoOrderPayment := new(dao.OrderPayment)
	if err := i.db.NewSelect().Model(daoOrderPayment).Where("id = ?", id).Scan(ctx); err != nil {
		return nil, err
	}
	return toOrderPayment(daoOrderPayment), nil
}

func toDaoOrderPayment(orderPayment *model.OrderPayment) *dao.OrderPayment {
	return &dao.OrderPayment{
		ID:            orderPayment.GetId(),
		OrderID:       orderPayment.GetOrderId(),
		PaymentType:   uint(orderPayment.GetPaymentType()),
		ReceiveAmount: orderPayment.ReceiveAmount,
		PaymentAmount: orderPayment.PaymentAmount,
		ChangeAmount:  orderPayment.GetChangeAmount(),
		PaymentAt:     orderPayment.GetPaymentAt().StdTime(),
		UpdatedAt:     orderPayment.GetUpdatedAt().StdTime(),
	}
}

func orderPaymentInsertQuery(q *bun.InsertQuery) *bun.InsertQuery {
	return q.On("CONFLICT (id) DO UPDATE").Set("payment_type = EXCLUDED.payment_type").Set("receive_amount = EXCLUDED.receive_amount").Set("payment_amount = EXCLUDED.payment_amount").Set("change_amount = EXCLUDED.change_amount")
}

func (i *orderPaymentDb) Save(ctx context.Context, orderPayment *model.OrderPayment) error {
	daoOrderPayment := toDaoOrderPayment(orderPayment)
	if _, err := orderPaymentInsertQuery(i.db.NewInsert().Model(daoOrderPayment)).Exec(ctx); err != nil {
		return err
	}
	return nil
}

func (i *orderPaymentDb) SaveTx(ctx context.Context, tx interface{}, orderPayment *model.OrderPayment) error {
	bunTx := tx.(bun.Tx)
	daoOrderPayment := toDaoOrderPayment(orderPayment)
	if _, err := orderPaymentInsertQuery(bunTx.NewInsert().Model(daoOrderPayment)).Exec(ctx); err != nil {
		return err
	}
	return nil
}
