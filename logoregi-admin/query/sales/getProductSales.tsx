import { GetProductSalesRequestSchema } from "proto/scripts/pos/pos_service_pb";
import { formatDate } from "@/query/sales/formatDate";
import { useQuery } from "@connectrpc/connect-query";
import { getProductSales } from "proto/scripts/pos/pos_service-PosService_connectquery";
import { create } from "@bufbuild/protobuf";

export function useGetProductSales(startDate: Date, endDate: Date) {
  const request = create(GetProductSalesRequestSchema, {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  });
  
  return useQuery(getProductSales, request, { throwOnError: false });
}
