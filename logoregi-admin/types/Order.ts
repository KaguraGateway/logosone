import { Order as ProtoOrder, OrderItem as ProtoOrderItem, OrderType } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service_pb';
import { Product } from './Product';

export type Order = {
  id: string;
  orderAt: string;
  orderType: 'EatIn' | 'TakeOut';
  items: OrderItem[];
  totalPrice: number;
};

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  coffeeBrewId: string;
};

export function toOrderFromProto(order: ProtoOrder, products: Product[]): Order {
  // 商品IDから商品名を取得するためのマップを作成
  const productMap = new Map<string, Product>();
  products.forEach((product) => {
    productMap.set(product.id, product);
  });

  // 注文アイテムを変換
  const items: OrderItem[] = order.items.map((item) => {
    const product = productMap.get(item.productId);
    return {
      productId: item.productId,
      productName: product?.name || '不明な商品',
      quantity: item.quantity,
      price: Number(item.amount),
      coffeeBrewId: item.coffeeBrewId,
    };
  });

  // 合計金額を計算
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return {
    id: order.id,
    orderAt: order.orderAt,
    orderType: order.orderType === OrderType.EatIn ? 'EatIn' : 'TakeOut',
    items: items,
    totalPrice: totalPrice,
  };
}
