import { GetProductSalesRequest } from "@kaguragateway/cafelogos-grpc/scripts/pos/pos_service_pb";
import { formatDate } from "@/query/sales/formatDate";
import { useQuery } from "@connectrpc/connect-query";
import { getProductSales } from "@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery";

export function useGetProductSales(startDate: Date, endDate: Date) {
  const request = new GetProductSalesRequest({
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  });
  
  return useQuery(getProductSales, request, { throwOnError: false });
}
