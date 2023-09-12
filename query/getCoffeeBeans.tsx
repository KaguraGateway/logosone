import { useQuery } from '@tanstack/react-query';

import { CoffeeBeanResponse } from '@/types/CoffeeBean';

async function getData(): Promise<CoffeeBeanResponse> {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coffee-beans`);
  return await result.json();
}

export function useQueryCoffeeBeans() {
  return useQuery({
    queryKey: ['coffee-beans'],
    queryFn: getData,
  });
}
