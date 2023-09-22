package httpserver

import (
	"context"
	"fmt"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/application"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
	"github.com/cockroachdb/errors"
	"github.com/gorilla/websocket"
	"github.com/mitchellh/mapstructure"
	"github.com/samber/do"
)

type UpdateOrderItemStatus struct {
	updateOrderItemStatusUseCase application.UpdateOrderItemStatus
}

func NewUpdateOrderItemStatus(i *do.Injector) *UpdateOrderItemStatus {
	return &UpdateOrderItemStatus{
		updateOrderItemStatusUseCase: do.MustInvoke[application.UpdateOrderItemStatus](i),
	}
}

func (r *UpdateOrderItemStatus) UpdateOrderItemStatus(ctx context.Context, conn *websocket.Conn, event model.Event) error {
	var input application.UpdateOrderItemStatusInput
	err := mapstructure.Decode(event.GetMessage(), &input)
	if err != nil {
		return errors.WithMessage(ErrTypeAssertion, fmt.Sprintf("event.GetMessage(): %v", event.GetMessage()))
	}

	if err := r.updateOrderItemStatusUseCase.Execute(ctx, input); err != nil {
		return errors.Join(err, ErrExecute)
	}
	return nil
}
