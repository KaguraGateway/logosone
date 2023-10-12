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
} from '@chakra-ui/react';
import React from 'react';

import ProductQuantityControl from './ProductQuantityControl';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

export default function ChooseOptionModal(props: Props) {
  return (
    <>
      {/* モーダル */}
      <Modal closeOnOverlayClick={false} isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.100">
          <ModalHeader>ドリップ方法を選択</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* モーダル内のコンテンツ */}
            <Flex flexDir="column" gap={3}>
              <Flex flexDir="column" gap={3}>
                <ProductQuantityControl name="ペーパー" quantity={0} onQuantityChange={() => {}} />
                <ProductQuantityControl name="ネル" quantity={0} onQuantityChange={() => {}} />
                <ProductQuantityControl name="サイフォン" quantity={-1} onQuantityChange={() => {}} />
              </Flex>
            </Flex>
          </ModalBody>

          <ModalFooter>
            {/* モーダル内での操作ボタン */}
            <Button colorScheme="green" mr={3} onClick={props.onClose} width="100%">
              確認
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
