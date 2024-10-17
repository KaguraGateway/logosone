import {useQuery} from "@connectrpc/connect-query";
import {getDiscounts} from "@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery";

export function useQueryDiscounts() {
  return useQuery(getDiscounts, undefined, {throwOnError: false});
}
