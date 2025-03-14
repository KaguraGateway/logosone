import { getOrders } from 'proto/scripts/pos/pos_service-PosService_connectquery';
import { useQuery } from '@connectrpc/connect-query';

export function useQueryOrders() {
  return useQuery(getOrders, undefined, { throwOnError: false });
}
