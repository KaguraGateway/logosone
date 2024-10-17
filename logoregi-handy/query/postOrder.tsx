import { useMutation } from '@connectrpc/connect-query';
import { postOrder } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery';

export function usePostOrderMutation() {
  return useMutation(postOrder);
}
