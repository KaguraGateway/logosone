import { atom, useAtom } from 'jotai';

import { fetchProductsDTO, Product, ProductCategory } from '@/query/getProducts';
import { FilterItem } from '@/usecase/Filter';

type ProductCategoryWithProducts = ProductCategory & {
  products: Product[];
};

const productsAtom = atom(async () => {
  return await fetchProductsDTO();
});

export function useProduct() {
  const [products] = useAtom(productsAtom);

  const getProductByProductId = (productId: string) => {
    return products.find((product) => product.productId === productId);
  };
  const getProductCategoriesWithProducts = () => {
    const map = new Map<string, ProductCategoryWithProducts>();
    products.forEach((product) => {
      if (!map.has(product.productCategory.id)) {
        map.set(product.productCategory.id, {
          ...product.productCategory,
          products: [],
        });
      }
      map.get(product.productCategory.id)?.products.push(product);
    });
    return Array.from(map.values());
  };
  const getCoffeeBrew = (coffeeBrew: string) => {
    for (const product of products) {
      if (product.coffeeBrews.find((brew) => brew.id === coffeeBrew) != null) {
        return product.coffeeBrews.find((brew) => brew.id === coffeeBrew);
      }
    }
    return undefined;
  };
  const getDefaultFilterItems: () => FilterItem[] = () => {
    const productCategories = getProductCategoriesWithProducts();
    return productCategories.map((category) => ({
      id: category.id,
      name: category.name,
      checked: true,
      children: category.products.map((product) => ({
        id: product.productId,
        name: product.productName,
        checked: true,
        children: product.coffeeBrews.map((brew) => ({
          id: brew.id,
          name: brew.name,
          checked: true,
        })),
      })),
    }));
  };

  return { products, getProductByProductId, getProductCategoriesWithProducts, getCoffeeBrew, getDefaultFilterItems };
}
