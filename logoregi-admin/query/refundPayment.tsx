'use client';

export function useRefundPayment() {
  return {
    mutateAsync: async (paymentId: string) => {
      const baseUrl = process.env.NEXT_PUBLIC_GRPC_URL || 'http://localhost:8080';
      const response = await fetch(`${baseUrl}/pos.PosService/RefundPayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: paymentId,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '返金処理に失敗しました');
      }
      
      return await response.json();
    }
  };
}
