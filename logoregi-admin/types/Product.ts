import { Product as ProtoProduct, ProductType } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service_pb';

import { CoffeeBrew, toCoffeeBrewFromProto } from './CoffeeBrews';

export type Product = {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  type: string;
  isNowSales: boolean;
  // Coffee
  coffeeBeanId?: string;
  coffeeBeanName?: string;
  coffeeBeanGramQuantity?: number;
  coffeeBrews?: CoffeeBrew[];
  // Other
  amount?: number;
  stockId?: string;
  stockName?: string;
  stockQuantity?: number;

  isManagingOrder: boolean;
  isOlUseKitchen: boolean;
};

export function toProductFromProto(product: ProtoProduct): Product {
  return {
    id: product.productId,
    name: product.productName,
    categoryId: product.productCategory?.id ?? '',
    categoryName: product.productCategory?.name ?? '',
    type: product.productType === ProductType.COFFEE ? 'coffee' : 'other',
    isNowSales: product.isNowSales,
    coffeeBeanId: product.coffeeBean?.id,
    coffeeBeanName: product.coffeeBean?.name,
    coffeeBeanGramQuantity: product.coffeeBean?.gramQuantity,
    coffeeBrews: product.coffeeBrews.map((coffeeBrew) => toCoffeeBrewFromProto(coffeeBrew)),
    amount: Number(product.amount),
    stockId: product.stock?.id,
    stockName: product.stock?.name,
    stockQuantity: product.stock?.quantity,
    isManagingOrder: product.isManagingOrder,
    isOlUseKitchen: product.isOlKitchen,
  };
}

export type ProductsResponse = {
  products: Product[];
};

export type ProductBody = {
  id: string;
  name: string;
  categoryId: string;
  type: string;
  isNowSales: boolean;
  // Coffee
  coffeeBeanId?: string;
  coffeeBrews?: Array<CoffeeBrew>;
  // Other
  amount?: number;
  stockId?: string;
};

export type ProductPostRequest = Omit<ProductBody, 'id'>;
export type ProductPatchRequest = ProductBody;
