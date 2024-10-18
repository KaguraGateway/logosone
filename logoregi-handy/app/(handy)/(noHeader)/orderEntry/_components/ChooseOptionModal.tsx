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
  onConfirm: (id: string) => void;
  onQuantityChange: (id: string, newQuantity: number) => void;
  options: Array<{ id: string; name: string; quantity: number }>;
};

export default function ChooseOptionModal(props: Props) {
  return (
    <>
      {/* モーダル */}
      <Modal closeOnOverlayClick={true} isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.100">
          <ModalHeader>ドリップ方法を選択</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* モーダル内のコンテンツ */}
            <Flex flexDir="column" gap={3}>
              <Flex flexDir="column" gap={3}>
                {props.options.map((option) => (
                  <ProductQuantityControl
                    key={option.id}
                    name={option.name}
                    quantity={option.quantity}
                    onQuantityChange={(newQuantity) => props.onQuantityChange(option.id, newQuantity)}
                    onClick={() => props.onConfirm(option.id)}
                  />
                ))}
              </Flex>
            </Flex>
          </ModalBody>

          <ModalFooter>
            {/* モーダル内での操作ボタン */}
            <Button colorScheme="green" mr={3} onClick={props.onClose} width="100%">
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
