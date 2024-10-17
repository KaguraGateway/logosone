import { updateProduct } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery';
import { useMutation } from '@connectrpc/connect-query';

export function useMutationUpdateProduct() {
  return useMutation(updateProduct);
}
