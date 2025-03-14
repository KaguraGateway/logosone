import { getProducts } from 'proto/scripts/pos/pos_service-PosService_connectquery';
import { useQuery } from '@connectrpc/connect-query';

export function useQueryProducts() {
  return useQuery(getProducts, undefined, { throwOnError: false });
}
