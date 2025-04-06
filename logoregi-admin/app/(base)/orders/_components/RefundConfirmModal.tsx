'use client';

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Alert,
  AlertIcon,
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>返金確認</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
            <Alert status="error" mt={4} borderRadius="md">
              <AlertIcon />
              {errorMessage}
            </Alert>
          )}
          
          <Text mt={4} color="red.500">
            この操作は取り消せません。また、当日中の注文のみ返金可能です。
          </Text>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup spacing={3}>
            <Button
              onClick={onClose}
              variant="outline"
              isDisabled={isLoading}
            >
              キャンセル
            </Button>
            <Button
              colorScheme="red"
              onClick={handleRefund}
              isLoading={isLoading}
            >
              返金する
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
