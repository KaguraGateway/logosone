'use client';

import { Box, Text } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { SelectRoot, SelectTrigger, SelectValueText, SelectContent, SelectItem } from '@/components/ui/select';
import { Product } from '@/types/Product';

type Props = {
  label: string;
  products: Product[];
  selectedProductId: string | null;
  onChange: (productId: string | null) => void;
};

export function ProductFilter(props: Props) {
  const [open, setOpen] = useState(false);
  
  const productOptions = useMemo(() => {
    return [
      { label: 'すべて', value: '' },
      ...props.products.map((product) => ({
        label: product.name,
        value: product.id,
      })),
    ];
  }, [props.products]);
  
  const collection = useMemo(() => {
    return {
      items: productOptions,
    };
  }, [productOptions]);
  
  const value = props.selectedProductId ? [props.selectedProductId] : [''];
  
  const handleValueChange = (details: any) => {
    const selectedValue = details.value[0] || null;
    props.onChange(selectedValue === '' ? null : selectedValue);
  };
  
  return (
    <Box>
      <Text color="gray.500">{props.label}</Text>
      <SelectRoot 
        collection={collection} 
        open={open} 
        value={value} 
        onValueChange={handleValueChange}
        onOpenChange={(details) => setOpen(details.open)}
      >
        <SelectTrigger>
          <SelectValueText placeholder='商品を選択' />
        </SelectTrigger>
        <SelectContent>
          {productOptions.map((option) => (
            <SelectItem key={option.value} item={option}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}
