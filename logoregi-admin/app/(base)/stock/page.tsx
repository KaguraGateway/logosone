'use client';

import { Center, Spinner } from "@chakra-ui/react";
import { Table } from '@/ui/table/Table';
import { TableHeader } from '@/ui/table/TableHader';
import { Tbody } from '@/ui/table/Tbody';
import { Th } from '@/ui/table/Th';
import { useQueryStock } from "@/query/getStocks";
import { StockItem } from "./_components/StockItem";
import { StockFormDialog } from "@/app/(base)/_components/StockForm";
import { useState } from "react";
import { Button } from "@/ui/form/Button";

export default function StockPage() {
  const { data, isLoading } = useQueryStock();
  const [isOpenStockForm, setIsOpenStockForm] = useState(false);

  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    )
  }

  const stocks = data?.stocks || [];

  return (
    <>
      <Table>
        <TableHeader>
          <Th>ID</Th>
          <Th>在庫名</Th>
          <Th>個数</Th>
          <Th>編集 / 削除</Th>
        </TableHeader>
        <Tbody color='black'>
          {stocks.map((stock) => (
            <StockItem key={stock.id} stock={stock} />
          ))}
        </Tbody>
      </Table>
      <Button onClick={() => setIsOpenStockForm(true)} colorScheme="green">
        在庫を追加
      </Button>
      <StockFormDialog isOpen={isOpenStockForm} onClose={() => setIsOpenStockForm(false)} />
    </>
  );
}
