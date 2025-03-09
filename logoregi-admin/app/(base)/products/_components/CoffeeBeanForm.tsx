'use client';

import {
  Box,
  HStack,
  Stack,
} from '@chakra-ui/react';
import { getCoffeeBeans } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery';
import { useQueryClient } from '@tanstack/react-query';
import React, { ChangeEvent, useState } from 'react';

import { useMutationAddCoffeeBean } from '@/query/addCoffeeBean';
import { Button } from '@/ui/form/Button';
import { Input } from '@/ui/form/Input';
import { LoadingButton } from '@/ui/form/LoadingButton';

type Props = {
  onCancel: () => void;
};

export function CoffeeBeanForm(props: Props) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const client = useQueryClient();
  const addCoffeeBean = useMutationAddCoffeeBean();

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
    addCoffeeBean.mutateAsync(
      { name: name, gramQuantity: quantity },
      {
        onSuccess: () => {
          // TODO: ここでキャッシュを更新する
          //client.invalidateQueries(getCoffeeBeans.getQueryKey());
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
      <Stack gap={6}>
        <Input
          label="コーヒー豆名"
          placeholder="ブラジル"
          onChange={onChangeName}
          value={name}
          root={{ width: '50%' }}
        />
        <Input
          label="残りグラム数"
          placeholder="1000"
          onChange={onChangeQuantity}
          value={quantity.toString()}
          root={{ width: '50%' }}
        />
        <HStack width="full">
          <Button type="button" width="full" onClick={() => props.onCancel()}>
            キャンセル
          </Button>
          <LoadingButton type="submit" width="full" colorScheme="green" isLoading={isLoading}>
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

export function CoffeeBeanFormDialog(props: DialogProps) {
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
          コーヒー豆を追加 / 編集
        </Box>
        <Box p={4}>
          <CoffeeBeanForm onCancel={() => props.onClose()} />
        </Box>
      </Box>
    </Box>
  );
}
