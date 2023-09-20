package model

type Product struct {
	id          string
	name        string
	category    ProductCategory
	productType ProductType
	color       string
}

func RebuildProduct(id string, name string, category ProductCategory, productType ProductType, color string) *Product {
	return &Product{
		id:          id,
		name:        name,
		category:    category,
		productType: productType,
		color:       color,
	}
}

func (p *Product) Id() string {
	return p.id
}

func (p *Product) Name() string {
	return p.name
}

func (p *Product) Category() ProductCategory {
	return p.category
}

func (p *Product) ProductType() ProductType {
	return p.productType
}

func (p *Product) Color() string {
	return p.color
}
