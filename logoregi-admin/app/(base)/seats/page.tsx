'use client';
import { Table } from '@/ui/table/Table';
import { TableHeader } from '@/ui/table/TableHader';
import { Tbody } from '@/ui/table/Tbody';
import { TCollectionItem } from '@/ui/table/TCollectionItem';
import { Td } from '@/ui/table/Td';
import { Th } from '@/ui/table/Th';
import { Tr } from '@/ui/table/Tr';

import { AddButton } from './_components/AddButton';
import {useQuerySeats} from "@/query/getSeats";
import {toSeatFromProto} from "@/types/Seat";

export default function Seats() {
  const { data } = useQuerySeats();
  const seats = data?.seats?.map((seat) => {
    return toSeatFromProto(seat);
  }) ?? [];

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
