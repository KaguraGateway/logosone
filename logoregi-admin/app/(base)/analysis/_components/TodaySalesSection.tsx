'use client';

import { Box, Flex, Heading, Skeleton, Text } from '@chakra-ui/react';
import { useQuery } from '@connectrpc/connect-query';
import { useEffect, useState } from 'react';

import { getDailySales } from '@/query/sales/getDailySales';
import { GetDailySalesRequest } from '@/gen/proto/pos/pos_service_pb';

export function TodaySalesSection() {
  const [todaySales, setTodaySales] = useState(0);
  const [todayQuantity, setTodayQuantity] = useState(0);
  
  // 今日の日付を取得
  const today = new Date();
  const formattedDate = formatDate(today);
  
  const request = new GetDailySalesRequest({
    startDate: formattedDate,
    endDate: formattedDate,
  });
  
  const { data, isLoading, error } = useQuery(getDailySales, request);
  
  useEffect(() => {
    if (data && data.dailySales && data.dailySales.length > 0) {
      // 今日の売上を設定
      setTodaySales(Number(data.dailySales[0].totalSales));
      setTodayQuantity(Number(data.dailySales[0].totalQuantity));
    }
  }, [data]);

  // 日付をフォーマット（YYYY-MM-DD）
  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 金額をフォーマット（3桁ごとにカンマ区切り）
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP').format(amount);
  };

  return (
    <Box bg="gray.50" p={4} borderRadius="md" boxShadow="sm">
      <Heading as="h3" size="md" mb={2}>今日の売上</Heading>
      {isLoading ? (
        <Skeleton height="2rem" width="8rem" />
      ) : error ? (
        <Text color="red.500">データの取得に失敗しました</Text>
      ) : (
        <Flex direction="column">
          <Text fontSize="2xl" fontWeight="bold">¥{formatCurrency(todaySales)}</Text>
          <Text fontSize="sm" color="gray.600">{formatCurrency(todayQuantity)} 点</Text>
        </Flex>
      )}
    </Box>
  );
}
