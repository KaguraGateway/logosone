package model

type ProductCoffeeBrew struct {
	id   string
	name string
}

func RebuildProductCoffeeBrew(id string, name string) *ProductCoffeeBrew {
	return &ProductCoffeeBrew{
		id:   id,
		name: name,
	}
}

func (p *ProductCoffeeBrew) Id() string {
	return p.id
}

func (p *ProductCoffeeBrew) Name() string {
	return p.name
}
