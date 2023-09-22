package httpserver

import (
	"log"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"github.com/samber/do"
)

type WSReceiver struct {
	getOrders         GetOrders
	updateOrderStatus UpdateOrderStatus
}

func NewWSReceiver(i *do.Injector) *WSReceiver {
	return &WSReceiver{
		getOrders:         *NewGetOrders(i),
		updateOrderStatus: *NewUpdateOrderStatus(i),
	}
}

var upgrader = websocket.Upgrader{}

func (r *WSReceiver) OnReceive(ctx echo.Context) error {
	var err error
	conn, err := upgrader.Upgrade(ctx.Response(), ctx.Request(), nil)
	if err != nil {
		log.Printf("Upgrade error: %v", err)
		return err
	}
	defer conn.Close()

	var event model.Event
	for {
		err = conn.ReadJSON(event)
		if err != nil {
			log.Printf("Read error: %v", err)
			return err
		}

		// Event handling
		switch event.GetTopic() {
		case "GetOrders":
			err = r.getOrders.GetOrders(ctx.Request().Context(), conn, event)
		case "UpdateOrderStatus":
			err = r.updateOrderStatus.UpdateOrderStatus(ctx.Request().Context(), conn, event)
		}

		// Error handling
		if err != nil {
			log.Printf("Error: %v", err)
			return err
		}
	}
}
