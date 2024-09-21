package application

import (
	"context"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/model"
	"github.com/KaguraGateway/cafelogos-pos-backend/domain/repository"
	"github.com/samber/do"
)

type PostSeatParam struct {
	Name string
}

type PostSeat interface {
	Execute(ctx context.Context, param *PostSeatParam) error
}

type postSeatUseCase struct {
	seatRepo repository.SeatRepository
}

func NewPostSeatUseCase(i *do.Injector) (PostSeat, error) {
	return &postSeatUseCase{
		seatRepo: do.MustInvoke[repository.SeatRepository](i),
	}, nil
}
func (uc *postSeatUseCase) Execute(ctx context.Context, param *PostSeatParam) error {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	seat, err := model.NewSeat(param.Name)
	if err != nil {
		return err
	}

	if err := uc.seatRepo.Save(ctx, seat); err != nil {
		return err
	}
	return nil
}
