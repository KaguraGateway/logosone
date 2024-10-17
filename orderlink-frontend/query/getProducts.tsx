import { createPromiseClient } from '@connectrpc/connect';
import { PosService } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service_connect';

import { createTransport } from './transport';

export type ProductCategory = {
  id: string;
  name: string;
};
export type CoffeeBrew = {
  id: string;
  name: string;
};
export type Product = {
  productId: string;
  productName: string;
  productColor: string;
  productCategory: ProductCategory;
  coffeeBrews: Array<CoffeeBrew>;
};

export async function fetchProductsDTO(): Promise<Array<Product>> {
  const transport = createTransport();
  const client = createPromiseClient(PosService, transport);

  try {
    const data = await client.getProducts({});

    return (
      data?.products.map((product) => {
        return {
          productId: product.productId,
          productName: product.productName,
          productColor: 'blue.500',
          productCategory: {
            id: product.productCategory?.id ?? '',
            name: product.productCategory?.name ?? '',
          },
          coffeeBrews: product.coffeeBrews.map((brew) => {
            return {
              id: brew.id,
              name: brew.name,
            };
          }),
        };
      }) ?? []
    );
  } catch (e) {
    console.error(e);
  }

  return [];
}
