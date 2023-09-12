import { useMutation } from '@tanstack/react-query';

async function post(productId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
}

export function useMutationDeleteProduct() {
  return useMutation(post);
}
