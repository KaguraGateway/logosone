package httpserver

import (
	"github.com/labstack/echo/v4"
	"github.com/samber/do"
)

func RegisterRoutes(app *echo.Echo, i *do.Injector) {
	ws := NewWSReceiver(i)
	app.GET("/", func(ctx echo.Context) error {
		return ws.OnReceive(ctx)
	})
}
