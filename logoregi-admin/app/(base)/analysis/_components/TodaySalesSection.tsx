'use client';

import { Box, Flex, Heading, Skeleton, Text } from '@chakra-ui/react';

import { useGetDailySales } from '@/query/sales/getDailySales';

export function TodaySalesSection() {
  // 今日の日付を取得
  const today = new Date();
  const { data, isLoading, error } = useGetDailySales(today, today);

  // 金額をフォーマット（3桁ごとにカンマ区切り）
  const formatCurrency = (amount: bigint) => {
    return new Intl.NumberFormat('ja-JP').format(amount);
  };

  return (
    <Box bg="gray.50" p={4} borderRadius="md" boxShadow="sm">
      <Heading as="h3" size="md" mb={2}>今日の売上</Heading>
      {isLoading || !data ? (
        <Skeleton height="2rem" width="8rem" />
      ) : error ? (
        <Text color="red.500">データの取得に失敗しました</Text>
      ) : (
        <Flex direction="column">
          <Text fontSize="2xl" fontWeight="bold">¥{formatCurrency(data.dailySales[0]?.totalSales || BigInt(0))}</Text>
          <Text fontSize="sm" color="gray.600">{formatCurrency(data.dailySales[0]?.totalQuantity || BigInt(0))} 点</Text>
        </Flex>
      )}
    </Box>
  );
}
