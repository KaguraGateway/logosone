import { createConnectQueryKey, createPromiseClient } from "@connectrpc/connect-query";
import { createGrpcWebTransport } from "@connectrpc/connect-web";

import { PosService } from "@/gen/proto/pos/pos_service_connect";
import { GetProductSalesRequest } from "@/gen/proto/pos/pos_service_pb";
import { formatDate } from "./getDailySales";

const transport = createGrpcWebTransport({
  baseUrl: process.env.NEXT_PUBLIC_GRPC_URL || "http://localhost:8080",
});

const client = createPromiseClient(PosService, transport);

export const getProductSales = createConnectQueryKey(
  [PosService],
  async (request: GetProductSalesRequest) => {
    return await client.getProductSales(request);
  }
);

export function useGetProductSales() {
  // 過去1年間の商品別売上を取得
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  
  const request = new GetProductSalesRequest({
    startDate: formatDate(oneYearAgo),
    endDate: formatDate(today),
  });
  
  return { request };
}
