package application

import (
	"context"
	"log"
	"time"

	cookingtime "github.com/KaguraGateway/logosone/orderlink-backend/domain/model/cooking_time"
	"github.com/KaguraGateway/logosone/orderlink-backend/domain/repository"
	"github.com/samber/do"
)

type RecordCookingTimeInput struct {
	ProductId    string
	CookingTime  int // 秒単位
}

type RecordCookingTime interface {
	Execute(ctx context.Context, input RecordCookingTimeInput) error
}

type recordCookingTimeUseCase struct {
	cookingTimeRepo repository.CookingTimeRepository
	txRepo          repository.TxRepository
}

func NewRecordCookingTimeUseCase(i *do.Injector) (RecordCookingTime, error) {
	return &recordCookingTimeUseCase{
		cookingTimeRepo: do.MustInvoke[repository.CookingTimeRepository](i),
		txRepo:          do.MustInvoke[repository.TxRepository](i),
	}, nil
}

func (u *recordCookingTimeUseCase) Execute(ctx context.Context, input RecordCookingTimeInput) error {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	s := time.Now()

	cookingTime, err := u.cookingTimeRepo.FindByProductId(ctx, input.ProductId)
	if err != nil {
		return err
	}

	cookingTime.AddCookingTime(input.CookingTime)

	err = u.txRepo.Transaction(ctx, func(ctx context.Context, tx interface{}) error {
		return u.cookingTimeRepo.SaveTx(ctx, tx, cookingTime)
	})
	if err != nil {
		return err
	}

	log.Printf("RecordCookingTime time: %v", time.Since(s).String())

	return nil
}
