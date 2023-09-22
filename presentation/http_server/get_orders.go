package httpserver

import (
	"context"
	"fmt"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/application"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
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
		return errors.WithMessage(ErrTypeAssertion, fmt.Sprintf("event.GetMessage(): %v", event.GetMessage()))
	}

	output, err := r.getOrdersUseCase.Execute(ctx, input)
	if err != nil {
		return errors.Join(err, ErrExecute)
	}

	responseEvent, err := model.NewEvent("Orders", output)
	if err != nil {
		return errors.Join(err, ErrNewEvent)
	}

	if err := conn.WriteJSON(responseEvent); err != nil {
		return errors.Join(err, ErrWriteJSON)
	}
	return nil
}
