import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Stack,
} from '@chakra-ui/react';
import { useRef } from 'react';

type Props = {
  targetName: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export function DeleteConfirmDialog(props: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      isOpen={props.isOpen}
      leastDestructiveRef={cancelRef}
      onClose={props.onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {props.targetName} を本当に削除しますか？
          </AlertDialogHeader>

          <AlertDialogBody>
            削除すると元に戻すことはできません
          </AlertDialogBody>

          <AlertDialogFooter>
            <Stack direction="row" width="full" spacing={3}>
              <Button 
                ref={cancelRef} 
                variant="secondary" 
                onClick={props.onClose}
                flex="1"
              >
                キャンセル
              </Button>
              <Button 
                variant="error" 
                onClick={props.onDelete}
                flex="1"
              >
                削除
              </Button>
            </Stack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
