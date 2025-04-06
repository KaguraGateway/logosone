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
  useToast,
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="white" maxW="md">
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
          <Text mt={4} color="red.500">
            この操作は取り消せません。また、当日中の注文のみ返金可能です。
          </Text>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup spacing={3}>
            <Button
              onClick={onClose}
              variant="outline"
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
