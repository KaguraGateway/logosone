package bundb

import (
	"context"
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/KaguraGateway/logosone/logoregi-backend/infra/bundb/dao"
	"github.com/samber/do"
	"github.com/uptrace/bun"
)

type paymentExternalDb struct {
	db *bun.DB
}

func NewPaymentExternalDb(i *do.Injector) (repository.PaymentExternalRepository, error) {
	return &paymentExternalDb{
		db: do.MustInvoke[*bun.DB](i),
	}, nil
}

func toPaymentExternal(daoPaymentExternal dao.PaymentExternal) *model.PaymentExternal {
	paidAt := synchro.In[tz.UTC](daoPaymentExternal.PaidAt)
	return model.ReconstructPaymentExternal(daoPaymentExternal.ID, daoPaymentExternal.PaymentId, daoPaymentExternal.PaymentType, daoPaymentExternal.Status, daoPaymentExternal.ExternalServiceId, daoPaymentExternal.ExternalDeviceId, synchro.In[tz.UTC](daoPaymentExternal.CreatedAt), synchro.In[tz.UTC](daoPaymentExternal.UpdatedAt), &paidAt)
}

func (p paymentExternalDb) FindById(ctx context.Context, id string) (*model.PaymentExternal, error) {
	daoPaymentExternal := new(dao.PaymentExternal)
	if err := p.db.NewSelect().Model(daoPaymentExternal).Where("id = ?", id).Scan(ctx); err != nil {
		return nil, err
	}
	return toPaymentExternal(*daoPaymentExternal), nil
}

func (p paymentExternalDb) FindByPaymentId(ctx context.Context, paymentId string) (*model.PaymentExternal, error) {
	daoPaymentExternal := new(dao.PaymentExternal)
	if err := p.db.NewSelect().Model(daoPaymentExternal).Where("payment_id = ?", paymentId).Scan(ctx); err != nil {
		return nil, err
	}
	return toPaymentExternal(*daoPaymentExternal), nil
}

func (p paymentExternalDb) Save(ctx context.Context, paymentExternal *model.PaymentExternal) error {
	daoPaymentExternal := &dao.PaymentExternal{
		ID:                paymentExternal.GetId(),
		PaymentId:         paymentExternal.GetPaymentId(),
		PaymentType:       paymentExternal.GetPaymentType(),
		Status:            paymentExternal.GetStatus(),
		ExternalServiceId: paymentExternal.GetExternalServiceId(),
		ExternalDeviceId:  paymentExternal.GetExternalDeviceId(),
		CreatedAt:         paymentExternal.GetCreatedAt().StdTime(),
		UpdatedAt:         paymentExternal.GetUpdatedAt().StdTime(),
	}
	if _, err := p.db.NewInsert().Model(daoPaymentExternal).On("CONFLICT (id) DO UPDATE").Set("payment_id = EXCLUDED.payment_id").Set("payment_type = EXCLUDED.payment_type").Set("status = EXCLUDED.status").Set("external_service_id = EXCLUDED.external_service_id").Set("external_device_id = EXCLUDED.external_device_id").Exec(ctx); err != nil {
		return err
	}
	return nil
}

func (p paymentExternalDb) SaveTx(ctx context.Context, tx interface{}, paymentExternal *model.PaymentExternal) error {
	bunTx := tx.(*bun.Tx)
	daoPaymentExternal := &dao.PaymentExternal{
		ID:                paymentExternal.GetId(),
		PaymentId:         paymentExternal.GetPaymentId(),
		PaymentType:       paymentExternal.GetPaymentType(),
		Status:            paymentExternal.GetStatus(),
		ExternalServiceId: paymentExternal.GetExternalServiceId(),
		ExternalDeviceId:  paymentExternal.GetExternalDeviceId(),
		CreatedAt:         paymentExternal.GetCreatedAt().StdTime(),
		UpdatedAt:         paymentExternal.GetUpdatedAt().StdTime(),
	}
	if _, err := bunTx.NewInsert().Model(daoPaymentExternal).On("CONFLICT (id) DO UPDATE").Set("payment_id = EXCLUDED.payment_id").Set("payment_type = EXCLUDED.payment_type").Set("status = EXCLUDED.status").Set("external_service_id = EXCLUDED.external_service_id").Set("external_device_id = EXCLUDED.external_device_id").Exec(ctx); err != nil {
		return err
	}
	return nil
}

func (p paymentExternalDb) FindAllByStatuses(ctx context.Context, statuses []string) ([]*model.PaymentExternal, error) {
	daoPaymentExternals := make([]dao.PaymentExternal, 0)
	if err := p.db.NewSelect().Model(&daoPaymentExternals).Where("status IN (?)", bun.In(statuses)).Scan(ctx); err != nil {
		return nil, err
	}
	paymentExternals := make([]*model.PaymentExternal, 0)
	for _, daoPaymentExternal := range daoPaymentExternals {
		paymentExternals = append(paymentExternals, toPaymentExternal(daoPaymentExternal))
	}
	return paymentExternals, nil
}
