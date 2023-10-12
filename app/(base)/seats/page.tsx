import { createPromiseClient } from '@connectrpc/connect';
import { PosService } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service_connect';
import { cache } from 'react';

import { createTransport } from '@/app/transport';
import { toSeatFromProto } from '@/types/Seat';
import { Table } from '@/ui/table/Table';
import { TableHeader } from '@/ui/table/TableHader';
import { Tbody } from '@/ui/table/Tbody';
import { TCollectionItem } from '@/ui/table/TCollectionItem';
import { Td } from '@/ui/table/Td';
import { Th } from '@/ui/table/Th';
import { Tr } from '@/ui/table/Tr';

import { AddButton } from './_components/AddButton';

const getSeats = cache(async () => {
  const transport = createTransport();
  const client = createPromiseClient(PosService, transport);
  const data = await client.getSeats({});
  return data.seats.map((seat) => {
    return toSeatFromProto(seat);
  });
});

export default async function Seats() {
  const seats = await getSeats();

  return (
    <div>
      <Table>
        <TableHeader>
          <Th>ID</Th>
          <Th>名前</Th>
        </TableHeader>
        <Tbody>
          {seats.map((seat) => (
            <TCollectionItem key={seat.id}>
              <Tr>
                <Td>{seat.id}</Td>
                <Td>{seat.name}</Td>
              </Tr>
            </TCollectionItem>
          ))}
        </Tbody>
      </Table>
      <AddButton />
    </div>
  );
}
