import { createConnectQueryKey, createPromiseClient } from "@connectrpc/connect-query";
import { createGrpcWebTransport } from "@connectrpc/connect-web";

import { PosService } from "@/gen/proto/pos/pos_service_connect";
import { GetSalesByTimeSlotRequest } from "@/gen/proto/pos/pos_service_pb";
import { formatDate } from "./getDailySales";

const transport = createGrpcWebTransport({
  baseUrl: process.env.NEXT_PUBLIC_GRPC_URL || "http://localhost:8080",
});

const client = createPromiseClient(PosService, transport);

export const getSalesByTimeSlot = createConnectQueryKey(
  [PosService],
  async (request: GetSalesByTimeSlotRequest) => {
    return await client.getSalesByTimeSlot(request);
  }
);

export function useGetSalesByTimeSlot() {
  // 今日の時間帯別売上を取得
  const today = new Date();
  
  const request = new GetSalesByTimeSlotRequest({
    date: formatDate(today),
  });
  
  return { request };
}
