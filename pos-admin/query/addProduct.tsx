import { postProduct } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery';
import { useMutation } from '@tanstack/react-query';

export function useMutationAddProduct() {
  return useMutation(postProduct.useMutation());
}
