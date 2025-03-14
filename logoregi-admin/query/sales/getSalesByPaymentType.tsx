import { GetSalesByPaymentTypeRequestSchema } from "proto/scripts/pos/pos_service_pb";
import { formatDate } from "@/query/sales/formatDate";
import { useQuery } from "@connectrpc/connect-query";
import { getSalesByPaymentType } from "proto/scripts/pos/pos_service-PosService_connectquery";
import { create } from "@bufbuild/protobuf";

export function useGetSalesByPaymentType(startDate: Date, endDate: Date) {
  const request = create(GetSalesByPaymentTypeRequestSchema, {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  });
  
  return useQuery(getSalesByPaymentType, request, { throwOnError: false });
}
