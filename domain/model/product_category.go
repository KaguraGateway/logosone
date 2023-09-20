package model

type ProductCategory struct {
	id   string
	name string
}

func RebuildProductCategory(id string, name string) *ProductCategory {
	return &ProductCategory{
		id:   id,
		name: name,
	}
}

func (p *ProductCategory) Id() string {
	return p.id
}

func (p *ProductCategory) Name() string {
	return p.name
}
