'use client';
import {
  Box,
  Flex,
  HStack,
  Stack,
} from '@chakra-ui/react';
import { ChangeEvent, FormEvent, useState } from 'react';

import { useMutationAddSeat } from '@/query/addSeat';
import { Button } from '@/ui/form/Button';
import { Input } from '@/ui/form/Input';
import { LoadingButton } from '@/ui/form/LoadingButton';

export function SeatForm(props: { onCancel: () => void }) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useMutationAddSeat();

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const onSuccess = () => {
    props.onCancel();
    window.location.reload();
  };
  const onSettled = () => {
    setIsLoading(false);
  };
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    mutate.mutateAsync(
      {
        name: name,
      },
      { onSuccess, onSettled }
    );
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <Stack gap={6}>
          <Input label="名前" placeholder="テーブル1" onChange={onChangeName} value={name} />
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
    </>
  );
}

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SeatNewDailog(props: DialogProps) {
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
        minW="2xl"
        maxW="90%"
        maxH="90%"
        overflow="auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Box p={4} fontWeight="bold" borderBottomWidth="1px">
          座席を追加
        </Box>
        <Box p={4}>
          <SeatForm onCancel={props.onClose} />
        </Box>
      </Box>
    </Box>
  );
}
