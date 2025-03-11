package bundb

import (
	"context"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/KaguraGateway/logosone/logoregi-backend/infra/bundb/dao"
	"github.com/samber/do"
	"github.com/samber/lo"
	"github.com/uptrace/bun"
)

type seatDb struct {
	db *bun.DB
}

func NewSeatDb(i *do.Injector) (repository.SeatRepository, error) {
	return &seatDb{
		db: do.MustInvoke[*bun.DB](i),
	}, nil
}

func toSeat(daoSeat dao.Seat) *model.Seat {
	return model.ReconstructSeat(daoSeat.ID, daoSeat.Name, synchro.In[tz.UTC](daoSeat.CreatedAt), synchro.In[tz.UTC](daoSeat.UpdatedAt))
}

func (s seatDb) FindAll(ctx context.Context) ([]*model.Seat, error) {
	daoSeats := make([]dao.Seat, 0)
	if err := s.db.NewSelect().Model(&daoSeats).Scan(ctx); err != nil {
		return nil, err
	}
	seats := lo.Map(daoSeats, func(daoSeat dao.Seat, _ int) *model.Seat {
		return toSeat(daoSeat)
	})
	return seats, nil
}

func (s seatDb) FindById(ctx context.Context, id string) (*model.Seat, error) {
	daoSeat := new(dao.Seat)
	if err := s.db.NewSelect().Model(daoSeat).Where("id = ?", id).Scan(ctx); err != nil {
		return nil, err
	}
	return toSeat(*daoSeat), nil
}

func (s seatDb) Save(ctx context.Context, seat *model.Seat) error {
	daoSeat := &dao.Seat{
		ID:        seat.GetId(),
		Name:      seat.GetName(),
		CreatedAt: seat.GetCreatedAt().StdTime(),
		UpdatedAt: seat.GetUpdatedAt().StdTime(),
	}
	if _, err := s.db.NewInsert().Model(daoSeat).On("CONFLICT (id) DO UPDATE").Set("name = EXCLUDED.name").Exec(ctx); err != nil {
		return err
	}
	return nil
}

func (s seatDb) Delete(ctx context.Context, id string) error {
	if _, err := s.db.NewDelete().Model((*dao.Seat)(nil)).Where("id = ?", id).Exec(ctx); err != nil {
		return err
	}
	return nil
}
