'use client';

import { useMutation } from "@connectrpc/connect-query";
import { refundPayment } from "proto/scripts/pos/pos_service-PosService_connectquery";
import { RefundPaymentRequestSchema } from "proto/scripts/pos/pos_service_pb";

export function useRefundPayment() {
  return useMutation(refundPayment);
}
