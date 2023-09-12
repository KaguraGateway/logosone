import { useMutation } from '@tanstack/react-query';

import { ProductPostRequest } from '@/types/Product';

async function post(data: ProductPostRequest) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
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

export function useMutationAddProduct() {
  return useMutation(post);
}
