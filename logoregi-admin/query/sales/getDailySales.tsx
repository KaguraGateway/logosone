import { createConnectQueryKey, createPromiseClient } from "@connectrpc/connect-query";
import { createGrpcWebTransport } from "@connectrpc/connect-web";

import { PosService } from "@/gen/proto/pos/pos_service_connect";
import { GetDailySalesRequest } from "@/gen/proto/pos/pos_service_pb";

const transport = createGrpcWebTransport({
  baseUrl: process.env.NEXT_PUBLIC_GRPC_URL || "http://localhost:8080",
});

const client = createPromiseClient(PosService, transport);

export const getDailySales = createConnectQueryKey(
  [PosService],
  async (request: GetDailySalesRequest) => {
    return await client.getDailySales(request);
  }
);

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function useGetTotalSales() {
  // 過去1年間の売上を取得
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  
  const request = new GetDailySalesRequest({
    startDate: formatDate(oneYearAgo),
    endDate: formatDate(today),
  });
  
  return { request };
}
