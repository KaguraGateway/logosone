import { useQuery } from "@connectrpc/connect-query";

import { GetDailySalesRequest } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service_pb';
import { getDailySales } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery';
import { formatDate } from "@/query/sales/formatDate";

export function useGetTotalSales() {
  // 過去1年間の売上を取得
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  return useGetDailySales(oneYearAgo, today);
}

export function useGetDailySales(startDate: Date, endDate: Date) {
  const request = new GetDailySalesRequest({
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  });

  return useQuery(getDailySales, request, { throwOnError: false });
}
