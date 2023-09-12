import { useMutation, useQueryClient } from '@tanstack/react-query';

import { StockRequest } from '@/types/Stock';

async function post(data: StockRequest) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
}

export function useMutationAddStock() {
  const client = useQueryClient();
  return useMutation(post, {
    onSuccess: () => {
      client.invalidateQueries(['stock']);
    },
  });
}
