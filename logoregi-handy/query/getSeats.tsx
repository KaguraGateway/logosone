import { useTransport } from '@connectrpc/connect-query';
import { getSeats } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery';
import { useQuery } from '@tanstack/react-query';

export function useSeatQuery() {
  const transport = useTransport();
  return useQuery(getSeats.useQuery(undefined, { transport: transport }));
}
