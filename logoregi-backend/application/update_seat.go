package application

import (
	"context"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/samber/do"
)

type UpdateSeatParam struct {
	Id   string
	Name string
}

type UpdateSeat interface {
	Execute(ctx context.Context, param *UpdateSeatParam) error
}

type updateSeatUseCase struct {
	seatRepo repository.SeatRepository
}

func NewUpdateSeatUseCase(i *do.Injector) (UpdateSeat, error) {
	return &updateSeatUseCase{
		seatRepo: do.MustInvoke[repository.SeatRepository](i),
	}, nil
}

func (uc *updateSeatUseCase) Execute(ctx context.Context, param *UpdateSeatParam) error {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	seat, err := uc.seatRepo.FindById(ctx, param.Id)
	if err != nil {
		return err
	}

	if err := seat.SetName(param.Name); err != nil {
		return err
	}

	if err := uc.seatRepo.Save(ctx, seat); err != nil {
		return err
	}
	return nil
}
