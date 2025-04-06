'use client';

import {
  Box,
  Button,
  Flex,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Order } from '@/types/Order';

type RefundConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onSuccess: () => void;
};

export function RefundConfirmModal({ isOpen, onClose, order, onSuccess }: RefundConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRefund = async () => {
    if (!order.paymentId) {
      setErrorMessage('支払いIDが見つかりません');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const { useRefundPayment } = await import('@/query/refundPayment');
      const refundPaymentMutation = useRefundPayment();
      await refundPaymentMutation.mutateAsync(order.paymentId);
      
      console.log('返金処理が完了しました');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('返金処理エラー:', error);
      setErrorMessage(error instanceof Error ? error.message : '不明なエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;
  
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(0, 0, 0, 0.4)"
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={onClose}
    >
      <Box
        bg="white"
        borderRadius="md"
        width="auto"
        minW="md"
        maxW="90%"
        maxH="90%"
        overflow="auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Box p={4} fontWeight="bold" borderBottomWidth="1px">
          返金確認
        </Box>
        <Box p={4}>
          <Text mb={4}>以下の注文を返金します。よろしいですか？</Text>
          <Box p={4} bg="gray.50" borderRadius="md">
            <Flex justify="space-between" mb={2}>
              <Text fontWeight="bold">注文ID:</Text>
              <Text>{order.id}</Text>
            </Flex>
            <Flex justify="space-between" mb={2}>
              <Text fontWeight="bold">注文タイプ:</Text>
              <Text>{order.orderType === 'EatIn' ? 'イートイン' : 'テイクアウト'}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="bold">合計金額:</Text>
              <Text>{order.totalAmount}円</Text>
            </Flex>
          </Box>
          
          {errorMessage && (
            <Box mt={4} p={3} bg="red.50" color="red.500" borderRadius="md">
              {errorMessage}
            </Box>
          )}
          
          <Text mt={4} color="red.500">
            この操作は取り消せません。また、当日中の注文のみ返金可能です。
          </Text>
        </Box>
        <Box p={4} borderTopWidth="1px">
          <Flex width="100%" gap={3}>
            <Button
              flex="1"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              キャンセル
            </Button>
            <Button
              flex="1"
              colorScheme="red"
              onClick={handleRefund}
              isLoading={isLoading}
            >
              返金する
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
