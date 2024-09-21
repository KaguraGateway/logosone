import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';
import { IconContext } from 'react-icons';
import { MdOutlineClear } from 'react-icons/md';

type Props = React.ComponentProps<typeof Button> & {
  onCancel?: () => void;
};

export function CancelButton(props: Props) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const onClick = () => {
    setIsModalOpen(true);
  };
  const onCancel = () => {
    setIsModalOpen(false);
    props.onCancel?.();
  };
  const onClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        fontSize="sm"
        color="red.600"
        borderColor="red.600"
        w="50px"
        h="65px"
        {...props}
        onClick={onClick}
      >
        <IconContext.Provider value={{ size: '2rem' }}>
          <MdOutlineClear />
        </IconContext.Provider>
        取消
      </Button>
      <Modal isOpen={isModalOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>本当に操作を取り消しますか？</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button size="md" w="full" onClick={onClose} mr="3">
              キャンセル
            </Button>
            <Button size="md" w="full" colorScheme="red" onClick={onCancel}>
              取り消し
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
