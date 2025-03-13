'use client';

import { Flex, Stack } from '@chakra-ui/react';
import { Product } from '@/types/Product';
import { SortDirection } from './SortDirection';
import { ProductFilter } from './ProductFilter';

type SortType = 'orderTime' | 'totalAmount';
type SortDirection = 'asc' | 'desc';

type Props = {
  products: Product[];
  orderTimeDirection: SortDirection;
  onOrderTimeDirectionChange: (direction: SortDirection) => void;
  totalAmountDirection: SortDirection;
  onTotalAmountDirectionChange: (direction: SortDirection) => void;
  selectedProductId: string | null;
  onSelectedProductIdChange: (productId: string | null) => void;
  activeSortType: SortType;
  onActiveSortTypeChange: (sortType: SortType) => void;
};

export function FilterSortBar(props: Props) {
  return (
    <Flex direction={{ base: 'column', md: 'row' }} gap={4} mb={4} p={4} bg="gray.50" borderRadius="md">
      <Stack spacing={4} direction={{ base: 'column', md: 'row' }} flex={1}>
        <ProductFilter
          label="商品フィルター"
          products={props.products}
          selectedProductId={props.selectedProductId}
          onChange={props.onSelectedProductIdChange}
        />
        <SortDirection
          label="注文時間"
          value={props.orderTimeDirection}
          onChange={(direction) => {
            props.onOrderTimeDirectionChange(direction);
            props.onActiveSortTypeChange('orderTime');
          }}
        />
        <SortDirection
          label="合計金額"
          value={props.totalAmountDirection}
          onChange={(direction) => {
            props.onTotalAmountDirectionChange(direction);
            props.onActiveSortTypeChange('totalAmount');
          }}
        />
      </Stack>
    </Flex>
  );
}
