import { useQuery } from '@tanstack/react-query';

import { CategoriesResponse } from '@/types/Category';

async function getData(): Promise<CategoriesResponse> {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
  return await result.json();
}

export function useQueryCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getData,
  });
}
