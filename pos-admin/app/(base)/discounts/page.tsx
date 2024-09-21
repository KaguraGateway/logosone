import { createPromiseClient } from '@connectrpc/connect';
import { PosService } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service_connect';
import { cache } from 'react';

import { createTransport } from '@/app/transport';
import { toDiscountFromProto } from '@/types/Discount';
import { Table } from '@/ui/table/Table';
import { TableHeader } from '@/ui/table/TableHader';
import { Tbody } from '@/ui/table/Tbody';
import { TCollectionItem } from '@/ui/table/TCollectionItem';
import { Td } from '@/ui/table/Td';
import { Th } from '@/ui/table/Th';
import { Tr } from '@/ui/table/Tr';

import { AddButton } from './_components/AddButton';

const getDiscounts = cache(async () => {
  const transport = createTransport();
  const client = createPromiseClient(PosService, transport);
  const data = await client.getDiscounts({});
  return data.discounts.map((discount) => {
    return toDiscountFromProto(discount);
  });
});

export default async function Discounts() {
  const discounts = await getDiscounts();

  return (
    <div>
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
    </div>
  );
}
