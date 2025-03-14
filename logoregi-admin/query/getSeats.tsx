import {getSeats} from "proto/scripts/pos/pos_service-PosService_connectquery";
import {useQuery} from "@connectrpc/connect-query";

export function useQuerySeats() {
  return useQuery(getSeats, undefined, { throwOnError: false });
}