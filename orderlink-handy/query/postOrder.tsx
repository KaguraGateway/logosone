import { useTransport } from '@connectrpc/connect-query';
import { postOrder } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery';
import { useMutation } from '@tanstack/react-query';

export function usePostOrderMutation() {
  const transport = useTransport();
  return useMutation(postOrder.useMutation({ transport }));
}
