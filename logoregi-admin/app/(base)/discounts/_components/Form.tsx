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
import { DiscountType } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service_pb';
import { ChangeEvent, FormEvent, useState } from 'react';

import { useMutationAddDiscount } from '@/query/addDiscount';
import { Button } from '@/ui/form/Button';
import { Input } from '@/ui/form/Input';
import { LoadingButton } from '@/ui/form/LoadingButton';

export function DiscountForm(props: { onCancel: () => void }) {
  const [name, setName] = useState('');
  const [discountPrice, setDiscountPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useMutationAddDiscount();

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const onChangeDiscountPrice = (event: ChangeEvent<HTMLInputElement>) => {
    const num = Number(event.target.value);
    if (!isNaN(num)) {
      setDiscountPrice(num);
    }
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
        type: DiscountType.PRICE,
        discountPrice: BigInt(discountPrice),
      },
      { onSuccess, onSettled }
    );
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <Stack spacing={6}>
          <Input label="名前" placeholder="アツアツ割" onChange={onChangeName} value={name} />
          <Input label="割引価格" placeholder="100" onChange={onChangeDiscountPrice} value={discountPrice.toString()} />
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

export function DiscountNewDailog(props: DialogProps) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent minW="2xl">
        <ModalHeader>割引を追加</ModalHeader>
        <ModalBody pb={4}>
          <Stack spacing={4}>
            <DiscountForm onCancel={props.onClose} />
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
