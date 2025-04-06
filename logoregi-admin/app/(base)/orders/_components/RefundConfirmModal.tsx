'use client';

import { Box } from '@chakra-ui/react';
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRefund = async () => {
    if (!order.paymentId) {
      setErrorMessage('支払いIDが見つかりません');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const { refundPayment } = await import('@/query/refundPayment');
      await refundPayment(order.paymentId);
      
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
          {errorMessage && (
            <Box mt={4} p={3} bg="red.50" color="red.500" borderRadius="md">
              {errorMessage}
            </Box>
          )}
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
