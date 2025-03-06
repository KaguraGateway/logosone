'use client';

import {
  Box,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react';

import { useMutationAddStock } from '@/query/addStock';
import { Button } from '@/ui/form/Button';
import { Input } from '@/ui/form/Input';
import { LoadingButton } from '@/ui/form/LoadingButton';

type Props = {
  onCancel: () => void;
};

export function StockForm(props: Props) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const addStock = useMutationAddStock();

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const onChangeQuantity = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (!isNaN(value)) {
      setQuantity(value);
    }
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    addStock.mutateAsync(
      { name: name, quantity: quantity },
      {
        onSuccess: () => {
          props.onCancel();
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={6}>
        <Input
          label="在庫名"
          placeholder="パン"
          onChange={onChangeName}
          value={name}
          root={{ width: '50%' }}
        />
        <Input
          label="残り個数"
          placeholder="100"
          onChange={onChangeQuantity}
          value={quantity.toString()}
          root={{ width: '50%' }}
        />
        <HStack width="full">
          <Button type="button" width="full" onClick={() => props.onCancel()}>
            キャンセル
          </Button>
          <LoadingButton type="submit" width="full" variant="success" isLoading={isLoading}>
            作成
          </LoadingButton>
        </HStack>
      </Stack>
    </form>
  );
}

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function StockFormDialog(props: DialogProps) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent minW="xl">
        <ModalHeader>在庫を追加 / 編集</ModalHeader>
        <ModalBody pb={4}>
          <StockForm onCancel={() => props.onClose()} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
