package application

import (
	"context"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/repository"
	"github.com/samber/do"
)

type OnUpdatedOrderItemStatus interface {
	Execute(ctx context.Context, itemId string) error
}

type onUpdatedOrderItemStatusUseCase struct {
	orderItemRepo repository.OrderItemRepository
	clientPubsub  repository.SrvToClientPubService
}

func NewOnUpdatedOrderItemStatusUseCase(i *do.Injector) (OnUpdatedOrderItemStatus, error) {
	return &onUpdatedOrderItemStatusUseCase{
		orderItemRepo: do.MustInvoke[repository.OrderItemRepository](i),
		clientPubsub:  do.MustInvoke[repository.SrvToClientPubService](i),
	}, nil
}

func (u *onUpdatedOrderItemStatusUseCase) Execute(ctx context.Context, itemId string) error {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	// アイテムを取得
	orderItem, err := u.orderItemRepo.FindById(ctx, itemId)
	if err != nil {
		return err
	}

	output := UpdatedOrderItemStatusOutput{
		Id:     orderItem.Id(),
		Status: uint(orderItem.Status()),
	}

	// Clientに通知
	event, err := model.NewEvent("UpdatedOrderItemStatus", output)
	if err != nil {
		return err
	}
	return u.clientPubsub.Publish(ctx, *event)
}

type UpdatedOrderItemStatusOutput struct {
	Id     string
	Status uint
}
