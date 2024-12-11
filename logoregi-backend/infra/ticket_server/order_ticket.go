package ticket_server

import (
	"context"
	"github.com/KaguraGateway/logosone/logoregi-backend/infra/bundb/dao"
	"github.com/uptrace/bun"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/ticket"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/ticket/ticketconnect"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/samber/do"
)

type orderTicketServer struct {
	client ticketconnect.TicketServiceClient
	db     *bun.DB
}

func NewOrderTicketServer(i *do.Injector) (repository.OrderTicketRepository, error) {
	return &orderTicketServer{
		client: do.MustInvoke[ticketconnect.TicketServiceClient](i),
		db:     do.MustInvoke[*bun.DB](i),
	}, nil
}

func (i *orderTicketServer) Create(ctx context.Context, orderId string) (*model.OrderTicket, error) {
	issueTicket, err := i.client.IssueTicket(ctx, connect.NewRequest(&ticket.RequestIssueTicket{
		Prefix: "L",
	}))
	if err != nil {
		return nil, err
	}
	protoTicket := issueTicket.Msg.Ticket

	daoTicket := &dao.OrderTicket{
		TicketId:   protoTicket.Id,
		TicketAddr: protoTicket.TicketAddr,
		OrderId:    orderId,
	}
	if _, err := i.db.NewInsert().Model(daoTicket).Exec(ctx); err != nil {
		return nil, err
	}

	return model.ReconstructOrderTicket(orderId, protoTicket.Id, protoTicket.TicketAddr), nil
}

func (i *orderTicketServer) FindByOrderId(ctx context.Context, orderId string) (*model.OrderTicket, error) {
	daoTicket := new(dao.OrderTicket)
	if err := i.db.NewSelect().Model(daoTicket).Where("order_id = ?", orderId).Scan(ctx); err != nil {
		return nil, err
	}
	return model.ReconstructOrderTicket(orderId, daoTicket.TicketId, daoTicket.TicketAddr), nil
}
