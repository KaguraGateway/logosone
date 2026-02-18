'use client';

import { useQueryClient } from "@tanstack/react-query";
import { createConnectQueryKey, useMutation, useTransport } from "@connectrpc/connect-query";
import { refundPayment } from "proto/scripts/pos/pos_service-PosService_connectquery";
import { PosService } from "proto/scripts/pos/pos_service_pb";

export function useRefundPayment() {
  const queryClient = useQueryClient();
  const transport = useTransport();
  return useMutation(refundPayment, {
    onSuccess: async() => {
      await queryClient.invalidateQueries({
        queryKey: createConnectQueryKey({
          schema: PosService.method.getOrders,
          transport: transport,
          cardinality: "finite"
        })
      })
    }
  })
}
