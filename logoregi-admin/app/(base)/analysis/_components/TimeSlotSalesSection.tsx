'use client';

import { Box, Flex, Heading, Skeleton, Text, VStack } from '@chakra-ui/react';
import { useQuery } from '@connectrpc/connect-query';
import { useEffect, useState } from 'react';

import { getSalesByTimeSlot, useGetSalesByTimeSlot } from '@/query/sales/getSalesByTimeSlot';
import { TimeSlotSale } from '@/gen/proto/pos/pos_service_pb';

export function TimeSlotSalesSection() {
  const [timeSlotSales, setTimeSlotSales] = useState<TimeSlotSale[]>([]);
  const { request } = useGetSalesByTimeSlot();
  
  const { data, isLoading, error } = useQuery(getSalesByTimeSlot, request);
  
  useEffect(() => {
    if (data && data.timeSlotSales) {
      setTimeSlotSales(data.timeSlotSales);
    }
  }, [data]);

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
      ) : timeSlotSales.length === 0 ? (
        <Text>時間帯別の売上データがありません</Text>
      ) : (
        <VStack spacing={3} align="stretch">
          {timeSlotSales.map((slot, index) => (
            <Flex key={index} justify="space-between" p={2} borderBottom="1px" borderColor="gray.200">
              <Text fontWeight="medium">{slot.timeSlot}</Text>
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
