import { useQuery } from '@connectrpc/connect-query';
import { getSeats } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery';

export function useSeatQuery() {
  return useQuery(getSeats, undefined, { throwOnError: false });
}
