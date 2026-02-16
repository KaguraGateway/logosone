package application

import (
	"context"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/orderlink-backend/domain/model/order"
	"github.com/KaguraGateway/logosone/orderlink-backend/domain/repository"
	"github.com/samber/do"
	"github.com/samber/lo"
)

// OrderRepositoryからListOrdersを呼び出してOrderStatusHistoriesを取得
// 取得してもっとも最新の提供済みになったステータス履歴のcreated_at = served_at

type ListOrders interface {
	Execute(ctx context.Context) ([]*ListOrdersOutput, error)
}

type listOrdersUseCase struct {
	orderRepo repository.OrderRepository
}

var _ ListOrders = (*listOrdersUseCase)(nil)

func NewListOrdersUseCase(i *do.Injector) (ListOrders, error) {
	return &listOrdersUseCase{
		orderRepo: do.MustInvoke[repository.OrderRepository](i),
	}, nil
}

func (u *listOrdersUseCase) Execute(ctx context.Context) ([]*ListOrdersOutput, error) {
	// NOTE: QueryServiceで専用のを作ったほうがパフォーマンス的には良さそう
	orders, err := u.orderRepo.ListOrders(ctx)
	if err != nil {
		return nil, err
	}

	return lo.Map(orders, func(or *order.Order, _ int) *ListOrdersOutput {
		var servedAt synchro.Time[tz.UTC]

		for _, osh := range or.OrderStatusHistory() {
			if osh.Status() == order.Provided {
				servedAt = osh.CreatedAt()
			}
		}

		return &ListOrdersOutput{
			OrderId: or.Id(),
			OrderAt: or.OrderAt(),
			Type:    or.OrderType(),
			// TODO: ちゃんと返すようにする
			TicketId:   "",
			TicketAddr: "",
			Status:     or.Status(),
			ServedAt:   servedAt,
		}
	}), nil
}

type ListOrdersOutput struct {
	OrderId    string
	OrderAt    synchro.Time[tz.UTC]
	Type       order.OrderType
	TicketId   string
	TicketAddr string
	Status     order.OrderStatus
	ServedAt   synchro.Time[tz.UTC]
}
