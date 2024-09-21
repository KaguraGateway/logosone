'use client';
import { Dialog, DialogBackdrop, DialogContainer, DialogContent, DialogTitle, Portal } from '@ark-ui/react';
import { ChangeEvent, FormEvent, useState } from 'react';

import { css } from '@/panda/css';
import { HStack, Stack } from '@/panda/jsx';
import { dialog } from '@/panda/recipes';
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
        <Stack gap="6">
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
    <Dialog open={props.isOpen} onClose={props.onClose}>
      <Portal>
        <DialogBackdrop className={dialog()} />
        <DialogContainer className={dialog()}>
          <DialogContent className={css({ minW: '2xl' })}>
            <Stack gap="4" p="4">
              <DialogTitle>座席を追加</DialogTitle>
              <SeatForm onCancel={props.onClose} />
            </Stack>
          </DialogContent>
        </DialogContainer>
      </Portal>
    </Dialog>
  );
}
