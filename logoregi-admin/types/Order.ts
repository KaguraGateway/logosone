import { Order as ProtoOrder, OrderItem as ProtoOrderItem, OrderType } from 'proto/scripts/pos/pos_service_pb';
import { Product } from './Product';

export type Order = {
  id: string;
  orderAt: string;
  orderType: 'EatIn' | 'TakeOut';
  items: OrderItem[];
  totalAmount: number;
  paymentId?: string;
};

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  amount: number;
  coffeeBrewId: string;
  coffeeBrewName: string;
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
      amount: Number(item.amount),
      coffeeBrewId: item.coffeeBrewId,
      coffeeBrewName: product?.coffeeBrews?.find(coffeeBrew => coffeeBrew.id === item.coffeeBrewId)?.name ?? ''
    };
  });

  // 合計金額を計算
  const totalAmount = items.reduce((sum, item) => sum + (item.amount * item.quantity), 0);

  return {
    id: order.id,
    orderAt: order.orderAt,
    orderType: order.orderType === OrderType.EatIn ? 'EatIn' : 'TakeOut',
    items: items,
    totalAmount: totalAmount,
    paymentId: order.paymentId,
  };
}
