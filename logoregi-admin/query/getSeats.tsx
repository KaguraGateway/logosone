import {getSeats} from "@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery";
import {useQuery} from "@connectrpc/connect-query";

export function useQuerySeats() {
  return useQuery(getSeats, undefined, { throwOnError: false });
}