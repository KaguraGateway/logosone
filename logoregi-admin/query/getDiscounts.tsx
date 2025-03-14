import {useQuery} from "@connectrpc/connect-query";
import {getDiscounts} from "proto/scripts/pos/pos_service-PosService_connectquery";

export function useQueryDiscounts() {
  return useQuery(getDiscounts, undefined, {throwOnError: false});
}
