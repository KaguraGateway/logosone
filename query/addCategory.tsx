import { useMutation, useQueryClient } from '@tanstack/react-query';

type Request = {
  name: string;
};

async function post(data: Request) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
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

export function useMutationAddCategory() {
  const client = useQueryClient();
  return useMutation(post, {
    onSuccess: () => {
      client.invalidateQueries(['categories']);
    },
  });
}
