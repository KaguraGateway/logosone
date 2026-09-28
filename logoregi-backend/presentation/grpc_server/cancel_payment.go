package grpc_server

import (
	"context"
	"database/sql"

	"connectrpc.com/connect"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/common"
	"github.com/KaguraGateway/cafelogos-grpc/pkg/pos"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain"
	"github.com/cockroachdb/errors"
	"github.com/samber/do"
)

func (s *GrpcServer) CancelPayment(ctx context.Context, req *connect.Request[pos.CancelPaymentRequest]) (*connect.Response[common.Empty], error) {
	usecase := do.MustInvoke[application.CancelPayment](s.i)
	if err := usecase.Execute(ctx, req.Msg.PaymentId); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, connect.NewError(connect.CodeNotFound, err)
		}
		if errors.Is(err, domain.ErrPaymentAlreadyCanceled) {
			return nil, connect.NewError(connect.CodeFailedPrecondition, err)
		}
		if errors.Is(err, application.ErrInvalidParam) {
			return nil, connect.NewError(connect.CodeInvalidArgument, err)
		}
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&common.Empty{}), nil
}
