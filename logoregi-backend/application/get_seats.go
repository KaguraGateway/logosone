package application

import (
	"context"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/samber/do"
)

type GetSeats interface {
	Execute(ctx context.Context) ([]*model.Seat, error)
}

type getSeatsUseCase struct {
	seatRepo repository.SeatRepository
}

func NewGetSeatsUseCase(i *do.Injector) (GetSeats, error) {
	return &getSeatsUseCase{
		seatRepo: do.MustInvoke[repository.SeatRepository](i),
	}, nil
}

func (uc *getSeatsUseCase) Execute(ctx context.Context) ([]*model.Seat, error) {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	seats, err := uc.seatRepo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	return seats, nil
}
