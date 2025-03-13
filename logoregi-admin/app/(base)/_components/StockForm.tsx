'use client';

import {
  Box,
  HStack,
  Stack,
} from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react';

import { useMutationAddStock } from '@/query/addStock';
import { useMutationUpdateStock } from '@/query/updateStock';
import { Stock } from '@/types/Stock';
import { Button } from '@/ui/form/Button';
import { Input } from '@/ui/form/Input';
import { LoadingButton } from '@/ui/form/LoadingButton';

type Props = {
  stock?: Stock;
  onCancel: () => void;
};

export function StockForm(props: Props) {
  const [name, setName] = useState(props.stock?.name ?? '');
  const [quantity, setQuantity] = useState(props.stock?.quantity ?? 0);
  const [isLoading, setIsLoading] = useState(false);
  const addStock = useMutationAddStock();
  const updateStock = useMutationUpdateStock();

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

    const onSuccess = () => {
      props.onCancel();
    };
    const onSettled = () => {
      setIsLoading(false);
    };

    if (props.stock) {
      // 編集の場合
      updateStock.mutateAsync(
        { id: props.stock.id, name: name, quantity: quantity },
        {
          onSuccess,
          onSettled,
        }
      );
    } else {
      // 新規作成の場合
      addStock.mutateAsync(
        { name: name, quantity: quantity },
        {
          onSuccess,
          onSettled,
        }
      );
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack gap={6}>
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
          <Button type="button" onClick={() => props.onCancel()}>
            キャンセル
          </Button>
          <LoadingButton type="submit" colorScheme="green" isLoading={isLoading}>
            {props.stock ? '更新' : '作成'}
          </LoadingButton>
        </HStack>
      </Stack>
    </form>
  );
}

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  stock?: Stock;
};

export function StockFormDialog(props: DialogProps) {
  if (!props.isOpen) return null;
  
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
      onClick={props.onClose}
    >
      <Box
        bg="white"
        borderRadius="md"
        width="auto"
        minW="xl"
        maxW="90%"
        maxH="90%"
        overflow="auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Box p={4} fontWeight="bold" borderBottomWidth="1px">
          在庫を{props.stock ? '編集' : '追加'}
        </Box>
        <Box p={4}>
          <StockForm stock={props.stock} onCancel={() => props.onClose()} />
        </Box>
      </Box>
    </Box>
  );
}
