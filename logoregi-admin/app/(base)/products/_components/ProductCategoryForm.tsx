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
import { getProductCategories } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery';
import { useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, useState } from 'react';

import { useMutationAddCategory } from '@/query/addCategory';
import { Button } from '@/ui/form/Button';
import { Input } from '@/ui/form/Input';
import { LoadingButton } from '@/ui/form/LoadingButton';

type Props = {
  onCancel: () => void;
};

export function ProductCategoryForm(props: Props) {
  const client = useQueryClient();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const addCategory = useMutationAddCategory();

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    addCategory.mutateAsync(
      { name: name },
      {
        onSuccess: () => {
          //client.invalidateQueries(getProductCategories.getQueryKey());
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
          label="カテゴリ名"
          placeholder="ソフトドリンク"
          onChange={onChangeName}
          value={name}
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

export function ProductCategoryFormDialog(props: DialogProps) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent minW="xl">
        <ModalHeader>商品カテゴリを追加 / 編集</ModalHeader>
        <ModalBody pb={4}>
          <ProductCategoryForm onCancel={() => props.onClose()} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
