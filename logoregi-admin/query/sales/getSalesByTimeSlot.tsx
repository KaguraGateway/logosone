import { GetSalesByTimeSlotRequest } from "@kaguragateway/cafelogos-grpc/scripts/pos/pos_service_pb";
import { useQuery } from "@connectrpc/connect-query";
import { getSalesByTimeSlot } from "@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery";
import { formatDate } from "@/query/sales/formatDate";

export function useGetSalesByTimeSlot(date: Date) {
  const request = new GetSalesByTimeSlotRequest({
    date: formatDate(date),
  });

  return useQuery(getSalesByTimeSlot, request, { throwOnError: false });
}
