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

type UpdateOrderStatus struct {
	updateOrderStatusUseCase application.UpdateOrderStatus
}

func NewUpdateOrderStatus(i *do.Injector) *UpdateOrderStatus {
	return &UpdateOrderStatus{
		updateOrderStatusUseCase: do.MustInvoke[application.UpdateOrderStatus](i),
	}
}

func (r *UpdateOrderStatus) UpdateOrderStatus(ctx context.Context, conn *websocket.Conn, event model.Event) error {
	var input application.UpdateOrderStatusInput
	if err := mapstructure.Decode(event.GetMessage(), &input); err != nil  {
		return errors.WithMessage(ErrTypeAssertion, fmt.Sprintf("event.GetMessage(): %v", event.GetMessage()))
	}

	if err := r.updateOrderStatusUseCase.Execute(ctx, input); err != nil {
		return errors.Join(err, ErrExecute)
	}
	return nil
}
