package bundb

import (
	"context"

	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-orderlink-backend/domain/repository"
	"github.com/samber/do"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/driver/pgdriver"
)

type serverToServerPubSubBun struct {
	db *bun.DB
}

func NewServerToServerPubSubBun(i *do.Injector) (repository.SrvToSrvPubSubService, error) {
	return &serverToServerPubSubBun{
		db: do.MustInvoke[*bun.DB](i),
	}, nil
}

func (r *serverToServerPubSubBun) Publish(ctx context.Context, event model.Event) error {
	return pgdriver.Notify(ctx, r.db, event.GetTopic(), event.GetMessage().(string))
}

func (r *serverToServerPubSubBun) Subscribe(ctx context.Context, channel string, callback func(context.Context, model.Event)) error {
	var err error
	ln := pgdriver.NewListener(r.db)
	if err = ln.Listen(ctx, channel); err != nil {
		return err
	}
	var event *model.Event
	for notif := range ln.Channel() {
		event = model.RebuildEvent(notif.Channel, notif.Payload)
		callback(ctx, *event)
	}
	return nil
}
