'use client';
import {
  Box,
  HStack,
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
        <Stack gap={6}>
          <Input label="名前" placeholder="アツアツ割" onChange={onChangeName} value={name} />
          <Input label="割引価格" placeholder="100" onChange={onChangeDiscountPrice} value={discountPrice.toString()} />
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

export function DiscountNewDailog(props: DialogProps) {
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
          割引を追加
        </Box>
        <Box p={4}>
          <DiscountForm onCancel={props.onClose} />
        </Box>
      </Box>
    </Box>
  );
}
