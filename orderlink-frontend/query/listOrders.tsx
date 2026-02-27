import { createPromiseClient } from "@connectrpc/connect";
import { createOrderLinkTransport } from "./transport";
import { OrderLinkService } from "@kaguragateway/cafelogos-grpc/scripts/orderlink/orderlink_service_connect";

export async function fetchListOrders(): Array<> {
  const transport = createOrderLinkTransport();
  const client = createPromiseClient(OrderLinkService, transport);
}