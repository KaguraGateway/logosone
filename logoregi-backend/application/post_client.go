package application

import (
	"context"

	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/samber/do"
)

type PostClientParam struct {
	Name string
}

type PostClient interface {
	Execute(ctx context.Context, param PostClientParam) (*model.Client, error)
}

type postClientUseCase struct {
	clientRepo repository.ClientRepository
}

func NewPostClientUseCase(i *do.Injector) (PostClient, error) {
	return &postClientUseCase{
		clientRepo: do.MustInvoke[repository.ClientRepository](i),
	}, nil
}

func (uc *postClientUseCase) Execute(ctx context.Context, param PostClientParam) (*model.Client, error) {
	ctx, cancel := context.WithTimeout(ctx, CtxTimeoutDur)
	defer cancel()

	client, err := model.NewClient(param.Name)
	if err != nil {
		return nil, err
	}

	if err := uc.clientRepo.Save(ctx, client); err != nil {
		return nil, err
	}

	return client, nil
}
