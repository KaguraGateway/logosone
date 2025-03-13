'use client';

import { Box, Flex, Heading, Skeleton, Text, VStack } from '@chakra-ui/react';

import { useGetSalesByTimeSlot } from '@/query/sales/getSalesByTimeSlot';
import { useMemo } from "react";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function TimeSlotSalesSection() {
  const { data, isLoading, error } = useGetSalesByTimeSlot(new Date())

  // 金額をフォーマット（3桁ごとにカンマ区切り）
  const formatCurrency = (amount: number | bigint) => {
    return new Intl.NumberFormat('ja-JP').format(Number(amount));
  };

  return (
    <Box bg="gray.50" p={4} borderRadius="md" boxShadow="sm">
      <Heading as="h3" size="md" mb={4}>時間帯別売上</Heading>
      
      {isLoading ? (
        <Skeleton height="10rem" />
      ) : error ? (
        <Text color="red.500">データの取得に失敗しました</Text>
      ) : !data || data.timeSlotSales.length === 0 ? (
        <Text>時間帯別の売上データがありません</Text>
      ) : (
        <VStack gap={3} align="stretch">
          {data.timeSlotSales.map((slot, index) => (
            <Flex key={index} justify="space-between" p={2} borderBottom="1px" borderColor="gray.200">
              <Text fontWeight="medium">
                {format(toZonedTime(slot.startDate, 'Asia/Tokyo'), 'HH:mm:ss')}
                -
                {format(toZonedTime(slot.endDate, 'Asia/Tokyo'), 'HH:mm:ss')}
              </Text>
              <Flex direction="column" align="flex-end">
                <Text fontWeight="bold">¥{formatCurrency(slot.totalSales)}</Text>
                <Text fontSize="xs" color="gray.600">{formatCurrency(slot.totalQuantity)} 点</Text>
              </Flex>
            </Flex>
          ))}
        </VStack>
      )}
    </Box>
  );
}
