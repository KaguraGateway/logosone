import { useTransport } from '@connectrpc/connect-query';
import { getProducts } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery';
import { useQuery } from '@tanstack/react-query';

export function useProductQuery() {
  const transport = useTransport();
  return useQuery(getProducts.useQuery(undefined, { transport: transport }));
}
