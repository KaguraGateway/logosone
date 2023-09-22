package application

import (
	"context"
	"encoding/json"
	"unsafe"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/repository"
	"github.com/samber/do"
)

type OnUpdatedOrderStatus interface {
	Execute(ctx context.Context, orderId string) error
}

type onUpdatedOrderStatusUseCase struct {
	orderRepo    repository.OrderRepository
	clientPubsub repository.SrvToClientPubService
}

func NewOnUpdatedOrderStatusUseCase(i *do.Injector) (OnUpdatedOrderStatus, error) {
	return &onUpdatedOrderStatusUseCase{
		orderRepo:    do.MustInvoke[repository.OrderRepository](i),
		clientPubsub: do.MustInvoke[repository.SrvToClientPubService](i),
	}, nil
}

func (u *onUpdatedOrderStatusUseCase) Execute(ctx context.Context, orderId string) error {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	// 注文を取得
	order, err := u.orderRepo.FindById(ctx, orderId)
	if err != nil {
		return err
	}

	output := UpdatedOrderStatusOutput{
		Id:     order.Id(),
		Status: uint(order.Status()),
	}
	message, err := json.Marshal(output)
	if err != nil {
		return err
	}

	// Clientに通知
	event, err := model.NewEvent("UpdatedOrderStatus", *(*string)(unsafe.Pointer(&message)))
	if err != nil {
		return err
	}
	return u.clientPubsub.Publish(ctx, *event)
}

type UpdatedOrderStatusOutput struct {
	Id     string
	Status uint
}
