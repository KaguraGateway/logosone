import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
} from '@chakra-ui/react';
import React from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  errorTitle: string;
  errorMessage: string;
};

export default function ErrorModal(props: Props) {
  return (
    <>
      {/* モーダル */}
      <Modal closeOnOverlayClick={false} isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.100">
          <ModalHeader>{props.errorTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* モーダル内のコンテンツ */}
            <Flex flexDir="column" gap={3}>
              {props.errorMessage}
              <Spacer />
            </Flex>
          </ModalBody>

          <ModalFooter>
            {/* モーダル内での操作ボタン */}
            <Button colorScheme="gray" mr={3} onClick={props.onClose} width="100%" bg={'gray.600'} color={'white'}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
