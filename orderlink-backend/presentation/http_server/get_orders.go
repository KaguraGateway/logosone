package httpserver

import (
	"context"

	"github.com/KaguraGateway/logosone/orderlink-backend/application"
	"github.com/KaguraGateway/logosone/orderlink-backend/domain/model"
	"github.com/cockroachdb/errors"
	"github.com/gorilla/websocket"
	"github.com/samber/do"
)

type GetOrders struct {
	getOrdersUseCase application.GetOrders
}

func NewGetOrders(i *do.Injector) *GetOrders {
	return &GetOrders{
		getOrdersUseCase: do.MustInvoke[application.GetOrders](i),
	}
}

func (r *GetOrders) GetOrders(ctx context.Context, conn *websocket.Conn, event model.Event) error {
	input, ok := event.GetMessage().(application.GetOrdersInput)
	if !ok {
		input = application.GetOrdersInput{}
	}

	output, err := r.getOrdersUseCase.Execute(ctx, input)
	if err != nil {
		return errors.Join(err, ErrExecute)
	}

	responseEvent, err := model.NewEvent("Orders", output)
	if err != nil {
		return errors.Join(err, ErrNewEvent)
	}

	if err := conn.WriteJSON(FromEvent(responseEvent)); err != nil {
		return errors.Join(err, ErrWriteJSON)
	}
	return nil
}
