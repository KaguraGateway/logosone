'use client';

import { Box, Flex, Heading, Skeleton, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { useQuery } from '@connectrpc/connect-query';
import { useEffect, useState } from 'react';

import { getProductSales, useGetProductSales } from '@/query/sales/getProductSales';
import { ProductSale } from '@/gen/proto/pos/pos_service_pb';

export function ProductSalesSection() {
  const [productSales, setProductSales] = useState<ProductSale[]>([]);
  const { request } = useGetProductSales();
  
  const { data, isLoading, error } = useQuery(getProductSales, request);
  
  useEffect(() => {
    if (data && data.productSales) {
      setProductSales(data.productSales);
    }
  }, [data]);

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
      ) : productSales.length === 0 ? (
        <Text>商品別の売上データがありません</Text>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>商品名</Th>
                <Th isNumeric>売上金額</Th>
                <Th isNumeric>販売数</Th>
              </Tr>
            </Thead>
            <Tbody>
              {productSales.map((product, index) => (
                <Tr key={index}>
                  <Td>{product.productName}</Td>
                  <Td isNumeric>¥{formatCurrency(product.totalSales)}</Td>
                  <Td isNumeric>{formatCurrency(product.totalQuantity)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
}
