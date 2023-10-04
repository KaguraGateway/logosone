package grpc_server

import (
	"context"
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/cafelogos-pos-backend/application"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/samber/do"
	"github.com/samber/lo"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
)

func (s *GrpcServer) PostOrder(ctx context.Context, req *connect.Request[pos.PostOrderRequest]) (*connect.Response[pos.PostOrderResponse], error) {
	usecase := do.MustInvoke[application.PostOrder](s.i)
	reqOrder := req.Msg.Order

	var payment *application.OrderPaymentParam
	if reqOrder.Payment != nil {
		var err error
		payment, err = ToOrderPaymentParam(reqOrder.Payment)
		if err != nil {
			return nil, connect.NewError(connect.CodeInternal, err)
		}
	}
	orderAt, err := synchro.ParseISO[tz.UTC](reqOrder.OrderAt)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	param := application.PostOrderParam{
		Id: reqOrder.Id,
		OrderItems: lo.Map(reqOrder.Items, func(orderItem *pos.OrderItem, _ int) *application.OrderItemParam {
			return &application.OrderItemParam{
				ProductId:    orderItem.ProductId,
				Quantity:     uint64(orderItem.Quantity),
				Amount:       orderItem.Amount,
				CoffeeBrewId: orderItem.CoffeeBrewId,
			}
		}),
		OrderDiscounts: lo.Map(reqOrder.Discounts, func(orderDiscount *pos.OrderDiscount, _ int) *application.OrderDiscountParam {
			return &application.OrderDiscountParam{
				Id:            orderDiscount.Id,
				DiscountId:    orderDiscount.DiscountId,
				DiscountType:  model.DiscountType(orderDiscount.Type),
				DiscountPrice: orderDiscount.DiscountPrice,
			}
		}),
		OrderType: model.OrderType(reqOrder.OrderType),
		Payment:   payment,
		OrderAt:   orderAt,
		ClientId:  reqOrder.ClientId,
		SeatId:    reqOrder.SeatId,
	}

	order, ticket, err := usecase.Execute(ctx, param)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	var paymentResponse *pos.OrderPaymentResponse
	if order.GetPayment() != nil {
		paymentResponse = &pos.OrderPaymentResponse{
			IsOk:    true,
			Payment: ToProtoOrderPayment(order.GetPayment()),
		}
	}

	return connect.NewResponse(&pos.PostOrderResponse{
		CallNumber:      ticket.GetTicketAddr(),
		PaymentResponse: paymentResponse,
	}), nil
}
