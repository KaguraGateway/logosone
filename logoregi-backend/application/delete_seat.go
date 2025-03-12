package application

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/samber/do"
)

type DeleteSeat interface {
	Execute(ctx context.Context, id string) error
}

type deleteSeatUseCase struct {
	seatRepo repository.SeatRepository
}

func NewDeleteSeatUseCase(i *do.Injector) (DeleteSeat, error) {
	return &deleteSeatUseCase{
		seatRepo: do.MustInvoke[repository.SeatRepository](i),
	}, nil
}

func (uc *deleteSeatUseCase) Execute(ctx context.Context, id string) error {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	if err := uc.seatRepo.Delete(ctx, id); err != nil {
		return err
	}
	return nil
}
