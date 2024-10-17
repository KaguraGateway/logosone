import { getProductCategories } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery';
import { useQuery } from '@connectrpc/connect-query';

export function useQueryCategories() {
  return useQuery(getProductCategories, undefined, { throwOnError: false });
}
