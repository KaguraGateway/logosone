import { GetSalesByPaymentTypeRequest } from "proto/scripts/pos/pos_service_pb";
import { formatDate } from "@/query/sales/formatDate";
import { useQuery } from "@connectrpc/connect-query";
import { getSalesByPaymentType } from "proto/scripts/pos/pos_service-PosService_connectquery";

export function useGetSalesByPaymentType(startDate: Date, endDate: Date) {
  const request = new GetSalesByPaymentTypeRequest({
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  });
  
  return useQuery(getSalesByPaymentType, request, { throwOnError: false });
}
