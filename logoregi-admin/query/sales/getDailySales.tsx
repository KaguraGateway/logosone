import { useQuery } from "@connectrpc/connect-query";
import { create } from "@bufbuild/protobuf";

import { GetDailySalesRequestSchema } from 'proto/scripts/pos/pos_service_pb';
import { getDailySales } from 'proto/scripts/pos/pos_service-PosService_connectquery';
import { formatDate } from "@/query/sales/formatDate";

export function useGetTotalSales() {
  // 過去1年間の売上を取得
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  return useGetDailySales(oneYearAgo, today);
}

export function useGetDailySales(startDate: Date, endDate: Date) {
  const request = create(GetDailySalesRequestSchema, {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  })

  return useQuery(getDailySales, request, { throwOnError: false });
}
