'use client';

import { CoffeeBrew } from '@/types/CoffeeBrews';
import { Td } from '@/ui/table/Td';
import { Tr } from '@/ui/table/Tr';

export function CoffeeBrewItem({ coffeeBrew }: { coffeeBrew: CoffeeBrew }) {
  return (
    <Tr key={coffeeBrew.name}>
      <Td style={{ paddingLeft: '2rem' }}>{coffeeBrew.name}</Td>
      <Td>{coffeeBrew.amount.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' })}</Td>
      <Td></Td>
      <Td></Td>
      <Td></Td>
      <Td>{coffeeBrew.beanQuantityGrams}g</Td>
      <Td></Td>
    </Tr>
  );
}
