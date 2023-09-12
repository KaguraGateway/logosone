'use client';
import { Dialog, DialogBackdrop, DialogContainer, DialogContent, DialogTitle, Portal } from '@ark-ui/react';
import { ChangeEvent, useState } from 'react';

import { css } from '@/panda/css';
import { HStack, Stack } from '@/panda/jsx';
import { dialog } from '@/panda/recipes';
import { useMutationAddStock } from '@/query/addStock';
import { Button } from '@/ui/form/Button';
import { Input } from '@/ui/form/Input';
import { LoadingButton } from '@/ui/form/LoadingButton';

type Props = {
  onCancel: () => void;
};

export function StockForm(props: Props) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const addStock = useMutationAddStock();

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
    addStock.mutate({ name: name, quantity: quantity });
    setIsLoading(false);
    props.onCancel();
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="6">
        <Input
          label="在庫名"
          placeholder="パン"
          onChange={onChangeName}
          value={name}
          root={{ className: css({ w: '1/2' }) }}
        />
        <Input
          label="残り個数"
          placeholder="100"
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

export function StockFormDialog(props: DialogProps) {
  return (
    <Dialog open={props.isOpen} onClose={props.onClose}>
      <Portal>
        <DialogBackdrop className={dialog()} />
        <DialogContainer className={dialog({ size: 'md' })}>
          <DialogContent className={css({ minW: 'xl' })}>
            <Stack gap="4" p="4">
              <DialogTitle>在庫を追加 / 編集</DialogTitle>
              <StockForm onCancel={() => props.onClose()} />
            </Stack>
          </DialogContent>
        </DialogContainer>
      </Portal>
    </Dialog>
  );
}
