'use client';
import { Dialog, DialogBackdrop, DialogContainer, DialogContent, DialogTitle, Portal } from '@ark-ui/react';
import { getCoffeeBeans } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery';
import { useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, useState } from 'react';

import { css } from '@/panda/css';
import { HStack, Stack } from '@/panda/jsx';
import { dialog } from '@/panda/recipes';
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
          client.invalidateQueries(getCoffeeBeans.getQueryKey());
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
      <Stack gap="6">
        <Input
          label="コーヒー豆名"
          placeholder="ブラジル"
          onChange={onChangeName}
          value={name}
          root={{ className: css({ w: '1/2' }) }}
        />
        <Input
          label="残りグラム数"
          placeholder="1000"
          onChange={onChangeQuantity}
          value={quantity.toString()}
          root={{ className: css({ w: '1/2' }) }}
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
    <Dialog open={props.isOpen} onClose={props.onClose}>
      <Portal>
        <DialogBackdrop className={dialog()} />
        <DialogContainer className={dialog({ size: 'md' })}>
          <DialogContent className={css({ minW: 'xl' })}>
            <Stack gap="4" p="4">
              <DialogTitle>コーヒー豆を追加 / 編集</DialogTitle>
              <CoffeeBeanForm onCancel={() => props.onClose()} />
            </Stack>
          </DialogContent>
        </DialogContainer>
      </Portal>
    </Dialog>
  );
}
