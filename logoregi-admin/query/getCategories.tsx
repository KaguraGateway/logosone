import { getProductCategories } from 'proto/scripts/pos/pos_service-PosService_connectquery';
import { useQuery } from '@connectrpc/connect-query';

export function useQueryCategories() {
  return useQuery(getProductCategories, undefined, { throwOnError: false });
}
