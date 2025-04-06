package application

import (
	"context"
	"log"
	"time"

	"github.com/KaguraGateway/logosone/orderlink-backend/domain/repository"
	"github.com/samber/do"
)

type GetCookingTimes interface {
	Execute(ctx context.Context) ([]CookingTimeDTO, error)
}

type CookingTimeDTO struct {
	ProductId          string
	AverageCookingTime int
}

type getCookingTimesUseCase struct {
	cookingTimeRepo repository.CookingTimeRepository
}

func NewGetCookingTimesUseCase(i *do.Injector) (GetCookingTimes, error) {
	return &getCookingTimesUseCase{
		cookingTimeRepo: do.MustInvoke[repository.CookingTimeRepository](i),
	}, nil
}

func (u *getCookingTimesUseCase) Execute(ctx context.Context) ([]CookingTimeDTO, error) {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	s := time.Now()

	cookingTimes, err := u.cookingTimeRepo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	result := make([]CookingTimeDTO, len(cookingTimes))
	for i, ct := range cookingTimes {
		result[i] = CookingTimeDTO{
			ProductId:          ct.ProductId(),
			AverageCookingTime: ct.AverageCookingTime(),
		}
	}

	log.Printf("GetCookingTimes time: %v", time.Since(s).String())

	return result, nil
}
