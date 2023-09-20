package application

import (
	"context"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
	orderPkg "github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model/order"
	orderitem "github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model/order_item"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/repository"
	"github.com/cockroachdb/errors"
	"github.com/samber/do"
	"github.com/samber/lo"
)

type UpdateOrderItemStatusInput struct {
	Id     string
	Status uint
}

type UpdateOrderItemStatus interface {
	Execute(ctx context.Context, input UpdateOrderItemStatusInput) error
}

type updateOrderItemStatusUseCase struct {
	orderRepo     repository.OrderRepository
	orderItemRepo repository.OrderItemRepository
	txRepo        repository.TxRepository
	pubsub        repository.SrvToSrvPubSubService
}

func NewUpdateOrderItemStatusUseCase(i *do.Injector) (UpdateOrderItemStatus, error) {
	return &updateOrderItemStatusUseCase{
		orderRepo:     do.MustInvoke[repository.OrderRepository](i),
		orderItemRepo: do.MustInvoke[repository.OrderItemRepository](i),
		txRepo:        do.MustInvoke[repository.TxRepository](i),
		pubsub:        do.MustInvoke[repository.SrvToSrvPubSubService](i),
	}, nil
}

func (u *updateOrderItemStatusUseCase) Execute(ctx context.Context, input UpdateOrderItemStatusInput) error {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	// アイテムを取得
	orderItem, err := u.orderItemRepo.FindById(ctx, input.Id)
	if err != nil {
		return errors.Join(err, ErrOrderItemNotFound)
	}

	// ステータスを更新
	orderItem.UpdateStatus(orderitem.OrderItemStatus(input.Status))

	// 注文を取得
	order, err := u.orderRepo.FindById(ctx, orderItem.OrderId())
	if err != nil {
		return errors.Join(err, ErrOrderNotFound)
	}

	// 現在の注文状態
	currentOrderStatus := order.Status()
	// 注文の状態を更新する
	// 未調理→調理中への状態遷移
	if input.Status == uint(orderitem.Cooking) && order.Status() == orderPkg.NotYet {
		if err := order.UpdateStatus(orderPkg.Cooking); err != nil {
			return errors.Join(err, ErrInvalidParam)
		}
	} else
	// 調理中->未調理への状態遷移
	if input.Status == uint(orderitem.NotYet) && order.Status() == orderPkg.Cooking {
		notYetCount := lo.CountBy(order.OrderItems(), func(item orderitem.OrderItem) bool {
			return item.Status() == orderitem.OrderItemStatus(orderitem.NotYet)
		})
		if notYetCount+1 == len(order.OrderItems()) {
			order.UpdateStatus(orderPkg.NotYet)
		}
	} else
	// 調理中->調理完了への状態遷移
	if input.Status == uint(orderitem.Cooked) && order.Status() == orderPkg.Cooking {
		cookedCount := lo.CountBy(order.OrderItems(), func(item orderitem.OrderItem) bool {
			return item.Status() == orderitem.OrderItemStatus(orderitem.Cooked)
		})
		if cookedCount+1 == len(order.OrderItems()) {
			order.UpdateStatus(orderPkg.Cooked)
		}
	} else
	// 調理完了->調理中への状態遷移
	if input.Status == uint(orderitem.Cooking) && order.Status() == orderPkg.Cooked {
		order.UpdateStatus(orderPkg.Cooking)
	}

	err = u.txRepo.Transaction(ctx, func(ctx context.Context, tx model.Tx) error {
		// アイテムを保存
		if err := u.orderItemRepo.SaveTx(ctx, tx, orderItem); err != nil {
			return err
		}
		// 注文を保存
		if order.Status() != currentOrderStatus {
			if err := u.orderRepo.SaveTx(ctx, tx, order); err != nil {
				return err
			}
		}
		return nil
	})
	if err != nil {
		return err
	}

	// 各サーバーに通知
	event, err := model.NewEvent("UpdatedOrderItemStatus", orderItem.Id())
	if err != nil {
		return err
	}
	if err := u.pubsub.Publish(ctx, *event); err != nil {
		return err
	}

	if currentOrderStatus != order.Status() {
		event, err := model.NewEvent("UpdatedOrderStatus", order.Id())
		if err != nil {
			return err
		}
		if err := u.pubsub.Publish(ctx, *event); err != nil {
			return err
		}
	}

	return nil
}
