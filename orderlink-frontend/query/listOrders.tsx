import { createClient } from "@connectrpc/connect";
import { createOrderLinkTransport } from "./transport";
import { OrderLinkService } from "@kaguragateway/cafelogos-grpc/scripts/orderlink/orderlink_service_pb";
import type { Order as ProtoOrder } from "@kaguragateway/cafelogos-grpc/scripts/orderlink/orderlink_service_pb";
import type { OrderStatus, OrderType } from "@/zod/orders";

export type Order = {
  id: string;
  orderAt: string;
  type: OrderType;
  ticketId: string;
  ticketAddr: string;
  seatName: string;
  status: OrderStatus;
  servedAt: string;
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