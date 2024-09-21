import { getProducts } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery';
import { useQuery } from '@tanstack/react-query';

export function useQueryProducts() {
  return useQuery(getProducts.useQuery());
}
