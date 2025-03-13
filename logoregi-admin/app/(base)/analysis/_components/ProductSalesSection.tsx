'use client';

import { Box, Heading, Skeleton, Text } from '@chakra-ui/react';
import { useGetProductSales } from "@/query/sales/getProductSales";
import { Table } from "@/ui/table/Table";
import { TableHeader } from "@/ui/table/TableHader";
import { Tr } from "@/ui/table/Tr";
import { Th } from "@/ui/table/Th";
import { Tbody } from "@/ui/table/Tbody";
import { Td } from "@/ui/table/Td";

export function ProductSalesSection() {
  const today = new Date()
  const { data, isLoading, error } = useGetProductSales(today, today)

  // 金額をフォーマット（3桁ごとにカンマ区切り）
  const formatCurrency = (amount: number | bigint) => {
    return new Intl.NumberFormat('ja-JP').format(Number(amount));
  };

  return (
    <Box bg="gray.50" p={4} borderRadius="md" boxShadow="sm">
      <Heading as="h3" size="md" mb={4}>商品別売上</Heading>

      {isLoading ? (
        <Skeleton height="20rem" />
      ) : error ? (
        <Text color="red.500">データの取得に失敗しました</Text>
      ) : !data || data.productSales.length === 0 ? (
        <Text>商品別の売上データがありません</Text>
      ) : (
        <Box overflowX="auto">
          <Table>
            <TableHeader>
              <Th>商品名</Th>
              <Th>淹れ方</Th>
              <Th>売上金額</Th>
              <Th>販売数</Th>
            </TableHeader>
            <Tbody>
              {data.productSales.map((product, index) => (
                <Tr key={index}>
                  <Td>{product.productName}</Td>
                  <Td>{product.coffeeBrewName}</Td>
                  <Td>¥{formatCurrency(product.totalSales)}</Td>
                  <Td>{formatCurrency(product.totalQuantity)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
}
