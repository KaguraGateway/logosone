import { createConnectQueryKey, createPromiseClient } from "@connectrpc/connect-query";
import { createGrpcWebTransport } from "@connectrpc/connect-web";

import { PosService } from "@/gen/proto/pos/pos_service_connect";
import { GetSalesByPaymentTypeRequest } from "@/gen/proto/pos/pos_service_pb";
import { formatDate } from "./getDailySales";

const transport = createGrpcWebTransport({
  baseUrl: process.env.NEXT_PUBLIC_GRPC_URL || "http://localhost:8080",
});

const client = createPromiseClient(PosService, transport);

export const getSalesByPaymentType = createConnectQueryKey(
  [PosService],
  async (request: GetSalesByPaymentTypeRequest) => {
    return await client.getSalesByPaymentType(request);
  }
);

export function useGetSalesByPaymentType() {
  // 過去1ヶ月の支払い方法別売上を取得
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  
  const request = new GetSalesByPaymentTypeRequest({
    startDate: formatDate(oneMonthAgo),
    endDate: formatDate(today),
  });
  
  return { request };
}
