package bundb

import (
	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/infra/bundb/dao"
)

func toProductCoffeeBrew(coffeeBrew dao.ProductCoffeeBrew) *model.ProductCoffeeBrew {
	return model.ReconstructProductCoffeeBrew(coffeeBrew.ID, coffeeBrew.ProductID, coffeeBrew.Name, uint32(coffeeBrew.BeanQuantityGrams), uint64(coffeeBrew.Amount), coffeeBrew.BrewingTime, synchro.In[tz.UTC](coffeeBrew.CreatedAt), synchro.In[tz.UTC](coffeeBrew.UpdatedAt))
}
