import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CoffeeBeanRequest } from '@/types/CoffeeBean';

async function post(data: CoffeeBeanRequest) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coffee-beans`, {
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

export function useMutationAddCoffeeBean() {
  const client = useQueryClient();
  return useMutation(post, {
    onSuccess: () => {
      client.invalidateQueries(['coffee-beans']);
    },
  });
}
