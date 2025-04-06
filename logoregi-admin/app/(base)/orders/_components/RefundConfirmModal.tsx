'use client';

import { Box, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { Order } from '@/types/Order';
import { Button } from '@/ui/form/Button';

type RefundConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onSuccess: () => void;
};

export function RefundConfirmModal({ isOpen, onClose, order, onSuccess }: RefundConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleRefund = async () => {
    setIsLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_GRPC_URL || 'http://localhost:8080';
      const response = await fetch(`${baseUrl}/pos.PosService/RefundPayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: order.paymentId,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '返金処理に失敗しました');
      }
      
      toast({
        title: '返金処理が完了しました',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('返金処理エラー:', error);
      toast({
        title: '返金処理に失敗しました',
        description: error instanceof Error ? error.message : '不明なエラーが発生しました',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <Box p={4} fontWeight="bold" borderBottomWidth="1px">
          返金確認
        </Box>
        <Box p={4}>
          <Box mb={4}>以下の注文を返金します。よろしいですか？</Box>
          <Box p={4} bg="gray.50" borderRadius="md">
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Box fontWeight="bold">注文ID:</Box>
              <Box>{order.id}</Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Box fontWeight="bold">注文タイプ:</Box>
              <Box>{order.orderType === 'EatIn' ? 'イートイン' : 'テイクアウト'}</Box>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box fontWeight="bold">合計金額:</Box>
              <Box>{order.totalAmount}円</Box>
            </Box>
          </Box>
          <Box mt={4} color="red.500">
            この操作は取り消せません。また、当日中の注文のみ返金可能です。
          </Box>
        </Box>
        <Box p={4} borderTopWidth="1px">
          <Box display="flex" width="100%" gap={3}>
            <Button 
              variant="outline" 
              onClick={onClose}
              style={{ flex: 1 }}
            >
              キャンセル
            </Button>
            <Button 
              colorScheme="red" 
              onClick={handleRefund}
              isLoading={isLoading}
              style={{ flex: 1 }}
            >
              返金する
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
