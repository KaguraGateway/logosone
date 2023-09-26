package httpserver

import (
	"log"
	"net/http"
	"slices"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"github.com/samber/do"
)

type WSReceiver struct {
	getOrders             GetOrders
	updateOrderStatus     UpdateOrderStatus
	updateOrderItemStatus UpdateOrderItemStatus
	clients               *[]*websocket.Conn
}

func NewWSReceiver(i *do.Injector) *WSReceiver {
	return &WSReceiver{
		getOrders:             *NewGetOrders(i),
		updateOrderStatus:     *NewUpdateOrderStatus(i),
		updateOrderItemStatus: *NewUpdateOrderItemStatus(i),
		clients:               do.MustInvoke[*[]*websocket.Conn](i),
	}
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type EventInput struct {
	Topic   string
	Message interface{}
}

func (r *WSReceiver) OnReceive(ctx echo.Context) error {
	var err error
	conn, err := upgrader.Upgrade(ctx.Response(), ctx.Request(), nil)
	if err != nil {
		log.Printf("Upgrade error: %v", err)
		return err
	}
	defer conn.Close()

	// Close Handler
	conn.SetCloseHandler(func(code int, text string) error {
		*r.clients = slices.DeleteFunc(*r.clients, func(tConn *websocket.Conn) bool {
			return tConn == conn
		})
		return nil
	})
	// Add client
	*r.clients = append(*r.clients, conn)

	var eventInput EventInput
	var event *model.Event
	for {
		err = conn.ReadJSON(&eventInput)
		if err != nil {
			log.Printf("Read error: %v", err)
			return err
		}
		event, err = model.NewEvent(eventInput.Topic, eventInput.Message)
		if err != nil {
			return err
		}

		// Event handling
		switch event.GetTopic() {
		case "GetOrders":
			err = r.getOrders.GetOrders(ctx.Request().Context(), conn, *event)
		case "UpdateOrderStatus":
			err = r.updateOrderStatus.UpdateOrderStatus(ctx.Request().Context(), conn, *event)
		case "UpdateOrderItemStatus":
			err = r.updateOrderItemStatus.UpdateOrderItemStatus(ctx.Request().Context(), conn, *event)
		}

		// Error handling
		if err != nil {
			log.Printf("Error: %v", err)
			return err
		}
	}
}
