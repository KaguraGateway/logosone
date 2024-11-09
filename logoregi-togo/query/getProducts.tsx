import { useQuery } from '@connectrpc/connect-query';
import { getProducts } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery';

export function useProductQuery() {
  return useQuery(getProducts, undefined, { throwOnError: false });
}
