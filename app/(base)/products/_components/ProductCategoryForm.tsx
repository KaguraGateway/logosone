'use client';
import { Dialog, DialogBackdrop, DialogContainer, DialogContent, DialogTitle, Portal } from '@ark-ui/react';
import { ChangeEvent, useState } from 'react';

import { css } from '@/panda/css';
import { HStack, Stack } from '@/panda/jsx';
import { dialog } from '@/panda/recipes';
import { useMutationAddCategory } from '@/query/addCategory';
import { Button } from '@/ui/form/Button';
import { Input } from '@/ui/form/Input';
import { LoadingButton } from '@/ui/form/LoadingButton';

type Props = {
  onCancel: () => void;
};

export function ProductCategoryForm(props: Props) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const addCategory = useMutationAddCategory();

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    addCategory.mutate({ name: name });
    setIsLoading(false);
    props.onCancel();
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="6">
        <Input
          label="カテゴリ名"
          placeholder="ソフトドリンク"
          onChange={onChangeName}
          value={name}
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

export function ProductCategoryFormDialog(props: DialogProps) {
  return (
    <Dialog open={props.isOpen} onClose={props.onClose}>
      <Portal>
        <DialogBackdrop className={dialog()} />
        <DialogContainer className={dialog({ size: 'md' })}>
          <DialogContent className={css({ minW: 'xl' })}>
            <Stack gap="4" p="4">
              <DialogTitle>商品カテゴリを追加 / 編集</DialogTitle>
              <ProductCategoryForm onCancel={() => props.onClose()} />
            </Stack>
          </DialogContent>
        </DialogContainer>
      </Portal>
    </Dialog>
  );
}
