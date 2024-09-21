import { postSeat } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery';
import { useMutation } from '@tanstack/react-query';

export function useMutationAddSeat() {
  return useMutation(postSeat.useMutation());
}
