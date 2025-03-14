import { getStocks } from 'proto/scripts/pos/pos_service-PosService_connectquery';
import { useQuery } from '@connectrpc/connect-query';

export function useQueryStock() {
  return useQuery(getStocks, undefined, { throwOnError: false });
}
