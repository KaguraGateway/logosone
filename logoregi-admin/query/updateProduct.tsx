import { updateProduct } from 'proto/scripts/pos/pos_service-PosService_connectquery';
import { createConnectQueryKey, useMutation, useTransport } from '@connectrpc/connect-query';
import { useQueryClient } from "@tanstack/react-query";
import { PosService } from "proto/scripts/pos/pos_service_pb";

export function useMutationUpdateProduct() {
  const queryClient = useQueryClient();
  const transport = useTransport();
  return useMutation(updateProduct, {
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: createConnectQueryKey({
          schema: PosService.method.getProducts,
          transport: transport,
          cardinality: "finite"
        })
      })
    }
  });
}
