import { createClient } from "@connectrpc/connect";
import { createOrderLinkTransport } from "./transport";
import { OrderLinkService } from "@kaguragateway/cafelogos-grpc/scripts/orderlink/orderlink_service_pb";
import { OrderStatus, OrderType } from "@/zod/orders";

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

export async function fetchListOrders(): Promise<Array<Order>> {
  const transport = createOrderLinkTransport();
  const client = createClient(OrderLinkService, transport);

  try {
    // TODO: ここでgRPCリクエストを送信して注文リストを取得するコードを実装
    const data = await client.listOrders({});
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  }

  return [];
}