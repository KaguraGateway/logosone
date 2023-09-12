import { useMutation } from '@tanstack/react-query';

import { ProductPatchRequest } from '@/types/Product';

async function post(data: ProductPatchRequest) {
  const { id, ...body } = data;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
}

export function useMutationUpdateProduct() {
  return useMutation(post);
}
