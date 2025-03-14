import { GetSalesByTimeSlotRequestSchema } from "proto/scripts/pos/pos_service_pb";
import { useQuery } from "@connectrpc/connect-query";
import { getSalesByTimeSlot } from "proto/scripts/pos/pos_service-PosService_connectquery";
import { formatDate } from "@/query/sales/formatDate";
import { create } from "@bufbuild/protobuf";

export function useGetSalesByTimeSlot(date: Date) {
  const request = create(GetSalesByTimeSlotRequestSchema, {
    date: formatDate(date),
  });

  return useQuery(getSalesByTimeSlot, request, { throwOnError: false });
}
