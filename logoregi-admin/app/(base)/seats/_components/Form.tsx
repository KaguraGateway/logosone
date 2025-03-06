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
        <Stack spacing={6}>
          <Input label="名前" placeholder="テーブル1" onChange={onChangeName} value={name} />
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
    </>
  );
}

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SeatNewDailog(props: DialogProps) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent minW="2xl">
        <ModalHeader>座席を追加</ModalHeader>
        <ModalBody pb={4}>
          <Stack spacing={4}>
            <SeatForm onCancel={props.onClose} />
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
