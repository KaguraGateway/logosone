package httpserver

import (
	"log"
	"net/http"
	"slices"

	"github.com/KaguraGateway/logosone/orderlink-backend/domain/model"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"github.com/samber/do"

	s2cWebSocket "github.com/KaguraGateway/logosone/orderlink-backend/infra/websocket"
)

type WSReceiver struct {
	getOrders             GetOrders
	updateOrderStatus     UpdateOrderStatus
	updateOrderItemStatus UpdateOrderItemStatus
	clients               *[]*s2cWebSocket.OrderLinkWSClient
}

func NewWSReceiver(i *do.Injector) *WSReceiver {
	return &WSReceiver{
		getOrders:             *NewGetOrders(i),
		updateOrderStatus:     *NewUpdateOrderStatus(i),
		updateOrderItemStatus: *NewUpdateOrderItemStatus(i),
		clients:               do.MustInvoke[*[]*s2cWebSocket.OrderLinkWSClient](i),
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
	olWSClient := &s2cWebSocket.OrderLinkWSClient{Conn: conn}

	// Close Handler
	olWSClient.SetCloseHandler(func(code int, text string) error {
		*r.clients = slices.DeleteFunc(*r.clients, func(tConn *s2cWebSocket.OrderLinkWSClient) bool {
			return tConn == olWSClient
		})
		return nil
	})
	// Add client
	*r.clients = append(*r.clients, olWSClient)

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
		case "ClientEventLog":
			log.Printf("ClientEventLog: %v", event.GetMessage())
		}

		// Error handling
		if err != nil {
			log.Printf("Error: %v", err)
			return err
		}
	}
}
