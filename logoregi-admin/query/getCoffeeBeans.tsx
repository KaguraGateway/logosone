import { getCoffeeBeans } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery';
import { useQuery } from '@connectrpc/connect-query';

export function useQueryCoffeeBeans() {
  return useQuery(getCoffeeBeans, undefined, { throwOnError: false });
}
