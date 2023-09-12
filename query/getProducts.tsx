import { useQuery } from '@tanstack/react-query';

import { ProductsResponse } from '@/types/Product';

export async function getProducts(): Promise<ProductsResponse> {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  return await result.json();
}

export function useQueryProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
}
