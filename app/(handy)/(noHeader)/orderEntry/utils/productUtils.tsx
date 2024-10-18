import { Product } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service_pb';

export const getProductInfo = (products: Product[], productId: string, coffeeBrewId?: string) => {
  const product = products.find((v) => v.productId === productId);
  const coffeeBrew = coffeeBrewId != null ? product?.coffeeBrews.find((v) => v.id === coffeeBrewId) : undefined;
  return { product, coffeeBrew };
};