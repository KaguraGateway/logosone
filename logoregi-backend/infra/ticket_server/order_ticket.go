package ticket_server

import (
	"connectrpc.com/connect"
	"context"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/ticket"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/ticket/ticketconnect"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/samber/do"
)

type orderTicketServer struct {
	client ticketconnect.TicketServiceClient
}

func NewOrderTicketServer(i *do.Injector) (repository.OrderTicketRepository, error) {
	return &orderTicketServer{client: do.MustInvoke[ticketconnect.TicketServiceClient](i)}, nil
}

func (i *orderTicketServer) Create(ctx context.Context, orderId string) (*model.OrderTicket, error) {
	issueTicket, err := i.client.IssueTicket(ctx, connect.NewRequest(&ticket.RequestIssueTicket{
		Prefix: "L",
	}))
	if err != nil {
		return nil, err
	}
	protoTicket := issueTicket.Msg.Ticket
	return model.ReconstructOrderTicket(orderId, protoTicket.Id, protoTicket.TicketAddr), nil
}
