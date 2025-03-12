'use client';

import { Box, Flex, Heading, Skeleton, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { useQuery } from '@connectrpc/connect-query';
import { useEffect, useState } from 'react';

import { getProductSales, useGetProductSales } from '@/query/sales/getProductSales';
import { ProductSale } from '@/gen/proto/pos/pos_service_pb';

export function CoffeeBrewSalesSection() {
  const [coffeeBrewSales, setCoffeeBrewSales] = useState<ProductSale[]>([]);
  const { request } = useGetProductSales();
  
  const { data, isLoading, error } = useQuery(getProductSales, request);
  
  useEffect(() => {
    if (data && data.productSales) {
      // コーヒー淹れ方のIDが存在する商品のみをフィルタリング
      const coffeeSales = data.productSales.filter(product => 
        product.coffeeBrewId && product.coffeeBrewId !== ''
      );
      setCoffeeBrewSales(coffeeSales);
    }
  }, [data]);

  // 金額をフォーマット（3桁ごとにカンマ区切り）
  const formatCurrency = (amount: number | bigint) => {
    return new Intl.NumberFormat('ja-JP').format(Number(amount));
  };

  return (
    <Box bg="gray.50" p={4} borderRadius="md" boxShadow="sm">
      <Heading as="h3" size="md" mb={4}>コーヒー淹れ方別売上</Heading>
      
      {isLoading ? (
        <Skeleton height="20rem" />
      ) : error ? (
        <Text color="red.500">データの取得に失敗しました</Text>
      ) : coffeeBrewSales.length === 0 ? (
        <Text>コーヒー淹れ方別の売上データがありません</Text>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>商品名</Th>
                <Th>淹れ方</Th>
                <Th isNumeric>売上金額</Th>
                <Th isNumeric>販売数</Th>
              </Tr>
            </Thead>
            <Tbody>
              {coffeeBrewSales.map((product, index) => (
                <Tr key={index}>
                  <Td>{product.productName}</Td>
                  <Td>{product.coffeeBrewName}</Td>
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
