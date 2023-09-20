package application

import (
	"context"
	"errors"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
	orderPkg "github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model/order"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/repository"
	"github.com/samber/do"
)

type UpdateOrderStatusInput struct {
	Id     string
	Status uint
}

type UpdateOrderStatus interface {
	Execute(ctx context.Context, input UpdateOrderStatusInput) error
}

type updateOrderStatusUseCase struct {
	orderRepo repository.OrderRepository
	pubsub    repository.SrvToSrvPubSubService
}

func NewUpdateOrderStatusUseCase(i *do.Injector) (UpdateOrderStatus, error) {
	return &updateOrderStatusUseCase{
		orderRepo: do.MustInvoke[repository.OrderRepository](i),
		pubsub:    do.MustInvoke[repository.SrvToSrvPubSubService](i),
	}, nil
}

func (u *updateOrderStatusUseCase) Execute(ctx context.Context, input UpdateOrderStatusInput) error {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	// 注文を取得
	order, err := u.orderRepo.FindById(ctx, input.Id)
	if err != nil {
		return err
	}

	// ユーザーからは更新できないステータス
	if input.Status == uint(orderPkg.NotYet) || input.Status == uint(orderPkg.Cooking) {
		return ErrInvalidParam
	}

	// ステータスを更新
	if err := order.UpdateStatus(orderPkg.OrderStatus(input.Status)); err != nil {
		return errors.Join(err, ErrInvalidParam)
	}

	if err := u.orderRepo.Save(ctx, order); err != nil {
		return err
	}

	// 各サーバーに通知
	event, err := model.NewEvent("UpdatedOrderStatus", order.Id())
	if err != nil {
		return err
	}
	if err := u.pubsub.Publish(ctx, *event); err != nil {
		return err
	}

	return nil
}
