'use client';

import {toDiscountFromProto} from '@/types/Discount';
import { Table } from '@/ui/table/Table';
import { TableHeader } from '@/ui/table/TableHader';
import { Tbody } from '@/ui/table/Tbody';
import { TCollectionItem } from '@/ui/table/TCollectionItem';
import { Td } from '@/ui/table/Td';
import { Th } from '@/ui/table/Th';
import { Tr } from '@/ui/table/Tr';

import { AddButton } from './_components/AddButton';
import {useQueryDiscounts} from "@/query/getDiscounts";

export default function Discounts() {
  const { data } = useQueryDiscounts();
  const discounts = data?.discounts?.map((discount) => {
    return toDiscountFromProto(discount);
  }) ?? [];

  return (
    <>
      <Table>
        <TableHeader>
          <Th>ID</Th>
          <Th>名前</Th>
          <Th>割引価格</Th>
        </TableHeader>
        <Tbody>
          {discounts.map((discount) => (
            <TCollectionItem key={discount.id}>
              <Tr>
                <Td>{discount.id}</Td>
                <Td>{discount.name}</Td>
                <Td>{Number(discount.discountPrice)}</Td>
              </Tr>
            </TCollectionItem>
          ))}
        </Tbody>
      </Table>
      <AddButton />
    </>
  );
}
