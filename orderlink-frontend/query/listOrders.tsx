import { createClient } from "@connectrpc/connect";
import { createOrderLinkTransport } from "./transport";
import { OrderLinkService } from "proto/scripts/orderlink/orderlink_service_pb";
import type { Order as ProtoOrder } from "proto/scripts/orderlink/orderlink_service_pb";
import type { OrderStatus, OrderType } from "@/zod/orders";
import type { OrderItemStatus } from "@/zod/order_items";

export type OrderItem = {
  id: string;
  productId: string;
  coffeeBrewId?: string;
  status: OrderItemStatus;
};

export type Order = {
  id: string;
  orderAt: string;
  type: OrderType;
  ticketId: string;
  ticketAddr: string;
  seatName: string;
  status: OrderStatus;
  servedAt: string;
  orderItems: OrderItem[];
};

function toOrder(o: ProtoOrder): Order {
  return {
    id: o.orderId,
    orderAt: o.orderAt,
    type: o.type as unknown as OrderType,
    ticketId: o.ticketId,
    ticketAddr: o.ticketAddr,
    seatName: o.seatName,
    status: o.status as unknown as OrderStatus,
    servedAt: o.servedAt ?? "",
    orderItems: o.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      coffeeBrewId: item.coffeeBrewId,
      status: item.status as unknown as OrderItemStatus,
    })),
  };
}

export async function fetchListOrders(): Promise<Array<Order>> {
  const transport = createOrderLinkTransport();
  const client = createClient(OrderLinkService, transport);

  try {
    const data = await client.listOrders({});
    return data.orders.map(toOrder);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  }

  return [];
}
