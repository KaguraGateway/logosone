'use client';

import {
  Button,
  Flex,
  Text,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Order } from '@/types/Order';
import { toaster } from '@/components/ui/toaster';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';

type RefundConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onSuccess: () => void;
};

export function RefundConfirmModal({ isOpen, onClose, order, onSuccess }: RefundConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  const handleRefund = async () => {
    if (!order.paymentId) {
      toaster.create({
        description: '支払いIDが見つかりません',
        type: 'error'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { useRefundPayment } = await import('@/query/refundPayment');
      const refundPaymentMutation = useRefundPayment();
      await refundPaymentMutation.mutateAsync(order.paymentId);
      
      toaster.create({
        description: '返金処理が完了しました'
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('返金処理エラー:', error);
      toaster.create({
        description: error instanceof Error ? error.message : '返金処理に失敗しました',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  
  return (
    <DialogRoot open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>返金確認</DialogTitle>
        </DialogHeader>
        <DialogBody>
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
          
          <Text mt={4} color="red.500">
            この操作は取り消せません。また、当日中の注文のみ返金可能です。
          </Text>
        </DialogBody>
        <DialogFooter>
          <Flex gap={3} width="100%">
            <Button
              flex="1"
              onClick={onClose}
              variant="outline"
              disabled={loading}
            >
              キャンセル
            </Button>
            <Button
              flex="1"
              colorScheme="red"
              onClick={handleRefund}
              disabled={loading}
            >
              {loading ? '処理中...' : '返金する'}
            </Button>
          </Flex>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
