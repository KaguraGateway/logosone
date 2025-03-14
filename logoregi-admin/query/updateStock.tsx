import { updateStock } from 'proto/scripts/pos/pos_service-PosService_connectquery';
import { useMutation } from '@connectrpc/connect-query';

export function useMutationUpdateStock() {
  return useMutation(updateStock);
}
