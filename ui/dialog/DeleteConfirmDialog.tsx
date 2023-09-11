import { Dialog, DialogBackdrop, DialogCloseTrigger, DialogContainer, DialogContent, DialogDescription, DialogTitle, Portal } from "@ark-ui/react";

import { Stack } from "@/panda/jsx";
import { dialog } from "@/panda/recipes"

import { Button } from "../Button";

type Props = {
  targetName: string,
  isOpen: boolean,
  onClose: () => void,
  onDelete: () => void,
}

export function DeleteConfirmDialog(props: Props) {
  return (
    <Dialog open={props.isOpen} onClose={props.onClose}>
      <Portal>
        <DialogBackdrop className={dialog()} />
        <DialogContainer className={dialog()}>
          <DialogContent>
            <Stack gap="8" p="8">
              <Stack gap="1">
                <DialogTitle>{props.targetName} を本当に削除しますか？</DialogTitle>
                <DialogDescription>削除すると元に戻すことはできません</DialogDescription>
              </Stack>
              <Stack gap="3" direction="row" width="full">
                <DialogCloseTrigger asChild>
                  <Button variant="secondary" width="full">キャンセル</Button>
                </DialogCloseTrigger>
                <Button variant="error" width="full" onClick={props.onDelete}>削除</Button>
              </Stack>
            </Stack>
          </DialogContent>
        </DialogContainer>
      </Portal>
    </Dialog>
  )
}