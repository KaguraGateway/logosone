package application

import (
	"context"
	"github.com/samber/lo"
	"log"
	"time"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/orderlink-backend/domain/model"
	orderPkg "github.com/KaguraGateway/logosone/orderlink-backend/domain/model/order"
	orderitem "github.com/KaguraGateway/logosone/orderlink-backend/domain/model/order_item"
	"github.com/KaguraGateway/logosone/orderlink-backend/domain/repository"
	"github.com/cockroachdb/errors"
	"github.com/samber/do"
)

type PostOrderItemInput struct {
	ProductId       string
	CoffeeBrewId    *string
	Quantity        uint
	IsManagingOrder bool
	IsOlUseKitchen  bool
}

type PostOrderInput struct {
	OrderId    string
	OrderAt    synchro.Time[tz.UTC]
	OrderItems []PostOrderItemInput
	OrderType  orderPkg.OrderType
	TicketId   string
	TicketAddr string
	SeatName   *string
}

type PostOrderFromPos interface {
	Execute(ctx context.Context, input *PostOrderInput) error
}

type postOrderFromPosUseCase struct {
	orderRepo       repository.OrderRepository
	orderItemRepo   repository.OrderItemRepository
	orderTicketRepo repository.OrderTicketRepository
	txRepo          repository.TxRepository
	pubsubService   repository.SrvToSrvPubSubService
}

func NewPostOrderFromPosUseCase(i *do.Injector) (PostOrderFromPos, error) {
	return &postOrderFromPosUseCase{
		orderRepo:       do.MustInvoke[repository.OrderRepository](i),
		orderItemRepo:   do.MustInvoke[repository.OrderItemRepository](i),
		orderTicketRepo: do.MustInvoke[repository.OrderTicketRepository](i),
		txRepo:          do.MustInvoke[repository.TxRepository](i),
		pubsubService:   do.MustInvoke[repository.SrvToSrvPubSubService](i),
	}, nil
}

func (u *postOrderFromPosUseCase) Execute(ctx context.Context, input *PostOrderInput) error {
	cctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	// 時間計測開始
	s := time.Now()

	// 既知の注文かどうかを確認する
	if exists, err := u.orderRepo.Exists(cctx, input.OrderId); exists {
		return nil
	} else if err != nil {
		return err
	}

	// トランザクションを開始する
	err := u.txRepo.Transaction(cctx, func(ctx context.Context, tx interface{}) error {
		// 注文アイテムを保存する
		var orderItems []orderitem.OrderItem
		for _, item := range input.OrderItems {
			// 注文管理しないのであれば、注文アイテムを保存せず無視する
			if !item.IsManagingOrder {
				log.Println("Skip order item because it is not managing order")
				continue
			}

			// 注文アイテムを保存
			for i := 0; i < int(item.Quantity); i++ {
				orderItem, err := orderitem.NewOrderItem(input.OrderId, item.ProductId, item.CoffeeBrewId)
				if err != nil {
					return errors.Join(err, ErrInvalidParam)
				}

				// TODO: 突貫工事なので、IsOlUseKitchenのもっといい処理方法を検討するべし
				if !item.IsOlUseKitchen {
					orderItem.UpdateStatus(orderitem.Cooked)
				}

				if err := u.orderItemRepo.SaveTx(cctx, tx, orderItem); err != nil {
					return err
				}
				orderItems = append(orderItems, *orderItem)
			}
		}

		// TODO: 注文管理をしない商品しかなかった場合の処理を考える
		if len(orderItems) == 0 {
			log.Println("No order items to save")
			return nil
		}

		order, err := orderPkg.NewOrder(input.OrderId, orderItems, input.OrderAt, input.OrderType, input.SeatName)
		if err != nil {
			return errors.Join(err, ErrInvalidParam)
		}

		// TODO: 全部 キッチン機能を使わないものだったらの処理を考える
		// というか、これってドメイン知識の流出なのでドメインモデルを見直すべき
		// とりあえず、キッチン機能を使わないものは調理済みにしておく
		cookedOrderItemsCount := lo.CountBy(orderItems, func(item orderitem.OrderItem) bool {
			return item.Status() == orderitem.Cooked
		})
		if cookedOrderItemsCount > 0 {
			if err := order.UpdateStatus(orderPkg.Cooking); err != nil {
				log.Printf("failed to update order status: %v", err)
			}
		}
		if cookedOrderItemsCount == len(orderItems) {
			if err := order.UpdateStatus(orderPkg.Cooked); err != nil {
				log.Printf("failed to update order status: %v", err)
			}
		}

		// 注文を保存する
		if err := u.orderRepo.SaveTx(cctx, tx, order); err != nil {
			return err
		}

		// Ticketを保存する
		ticket, err := model.NewOrderTicket(input.OrderId, input.TicketId, input.TicketAddr)
		if err != nil {
			return errors.Join(err, ErrInvalidParam)
		}
		if err := u.orderTicketRepo.SaveTx(cctx, tx, ticket); err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		return err
	}

	// 各サーバーに通知
	event, err := model.NewEvent("NewOrder", input.OrderId)
	if err != nil {
		return err
	}
	// TODO: Publish失敗した場合のエラー処理を考える
	if err := u.pubsubService.Publish(cctx, *event); err != nil {
		log.Printf("failed to publish event: %v", err)
		return err
	}

	log.Printf("PostOrderFromPos Time: %v", time.Since(s).String())

	return nil
}
