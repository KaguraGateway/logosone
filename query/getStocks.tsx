import { useQuery } from '@tanstack/react-query';

import { StockResponse } from '@/types/Stock';

async function getData(): Promise<StockResponse> {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stock`);
  return await result.json();
}

export function useQueryStock() {
  return useQuery({
    queryKey: ['stock'],
    queryFn: getData,
  });
}
