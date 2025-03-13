'use client';

import { Box, Flex, Heading, Skeleton, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { PaymentTypeSale } from "@kaguragateway/cafelogos-grpc/scripts/pos/pos_service_pb";
import { useGetSalesByPaymentType } from "@/query/sales/getSalesByPaymentType";


export function PaymentTypeSalesSection() {
  const [paymentTypeSales, setPaymentTypeSales] = useState<PaymentTypeSale[]>([]);
  const today = new Date()
  const { data, isLoading, error } = useGetSalesByPaymentType(today, today)
  
  useEffect(() => {
    if (data && data.paymentTypeSales) {
      setPaymentTypeSales(data.paymentTypeSales);
    }
  }, [data]);

  // 金額をフォーマット（3桁ごとにカンマ区切り）
  const formatCurrency = (amount: number | bigint) => {
    return new Intl.NumberFormat('ja-JP').format(Number(amount));
  };

  // 支払い方法の名前を取得
  const getPaymentTypeName = (type: number) => {
    switch (type) {
      case 0:
        return '現金';
      case 1:
        return '電子決済';
      default:
        return 'その他';
    }
  };

  return (
    <Box bg="gray.50" p={4} borderRadius="md" boxShadow="sm">
      <Heading as="h3" size="md" mb={4}>支払い方法別売上</Heading>
      
      {isLoading ? (
        <Skeleton height="10rem" />
      ) : error ? (
        <Text color="red.500">データの取得に失敗しました</Text>
      ) : paymentTypeSales.length === 0 ? (
        <Text>支払い方法別の売上データがありません</Text>
      ) : (
        <VStack gap={3} align="stretch">
          {paymentTypeSales.map((payment, index) => (
            <Flex key={index} justify="space-between" p={2} borderBottom="1px" borderColor="gray.200">
              <Text fontWeight="medium">{getPaymentTypeName(payment.paymentType)}</Text>
              <Flex direction="column" align="flex-end">
                <Text fontWeight="bold">¥{formatCurrency(payment.totalSales)}</Text>
                <Text fontSize="xs" color="gray.600">{formatCurrency(payment.totalQuantity)} 点</Text>
              </Flex>
            </Flex>
          ))}
        </VStack>
      )}
    </Box>
  );
}
