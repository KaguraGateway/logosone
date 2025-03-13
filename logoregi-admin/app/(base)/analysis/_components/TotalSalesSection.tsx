'use client';

import { Box, Flex, Grid, GridItem, Heading, Skeleton, Text } from '@chakra-ui/react';
import { useQuery } from '@connectrpc/connect-query';
import { useEffect, useState } from 'react';

import { useGetTotalSales } from '@/query/sales/getDailySales';

export function TotalSalesSection() {
  const [totalSales, setTotalSales] = useState(0);
  const { data, isLoading, error } = useGetTotalSales()
  
  useEffect(() => {
    if (data && data.dailySales) {
      // 全期間の売上合計を計算
      const total = data.dailySales.reduce((sum, sale) => sum + Number(sale.totalSales), 0);
      setTotalSales(total);
    }
  }, [data]);

  // 金額をフォーマット（3桁ごとにカンマ区切り）
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP').format(amount);
  };

  return (
    <Box bg="gray.50" p={4} borderRadius="md" boxShadow="sm">
      <Heading as="h3" size="md" mb={2}>総売上</Heading>
      {isLoading ? (
        <Skeleton height="2rem" width="8rem" />
      ) : error ? (
        <Text color="red.500">データの取得に失敗しました</Text>
      ) : (
        <Text fontSize="2xl" fontWeight="bold">¥{formatCurrency(totalSales)}</Text>
      )}
    </Box>
  );
}
