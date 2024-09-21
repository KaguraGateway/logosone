import { getProductCategories } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery';
import { useQuery } from '@tanstack/react-query';

export function useQueryCategories() {
  return useQuery(getProductCategories.useQuery());
}
