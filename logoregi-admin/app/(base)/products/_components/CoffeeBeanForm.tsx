'use client';

import {
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
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
      <Stack spacing={6}>
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

export function CoffeeBeanFormDialog(props: DialogProps) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent minW="xl">
        <ModalHeader>コーヒー豆を追加 / 編集</ModalHeader>
        <ModalBody pb={4}>
          <CoffeeBeanForm onCancel={() => props.onClose()} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
