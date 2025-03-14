'use client';

import {
  HStack,
  Box,
  Stack,
} from '@chakra-ui/react';
import { getProductCategories } from 'proto/scripts/pos/pos_service-PosService_connectquery';
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
      <Stack gap={6}>
        <Input
          label="カテゴリ名"
          placeholder="ソフトドリンク"
          onChange={onChangeName}
          value={name}
          root={{ width: '50%' }}
        />
        <HStack width="full">
          <Button type="button" onClick={() => props.onCancel()}>
            キャンセル
          </Button>
          <LoadingButton type="submit" colorScheme="green" isLoading={isLoading}>
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
          商品カテゴリを追加 / 編集
        </Box>
        <Box p={4}>
          <ProductCategoryForm onCancel={() => props.onClose()} />
        </Box>
      </Box>
    </Box>
  );
}
