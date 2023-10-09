import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, ModalFooter, Button, Radio, NumberInput, Input, Spacer, RadioGroup, Stack } from "@chakra-ui/react";
import React from "react";
import Link from 'next/link';


type Props = {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
  }

export default function WorkEndModal(props: Props) {
    return (
        <> 
        {/* モーダル */}
      <Modal closeOnOverlayClick={false} isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent bg="white" >
          <ModalHeader>ホール業務終了</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* モーダル内のコンテンツ */}
            <Flex flexDir="column" gap={3}>
                この操作は取り消せません。<br/>本当に終了しますか？
            <Spacer />

            </Flex>
          </ModalBody>

          <ModalFooter>
            {/* モーダル内での操作ボタン */}
            <Button colorScheme="gray" mr={3} onClick={props.onClose} width="100%">
              キャンセル
            </Button>
            <Button colorScheme="orange" mr={3} onClick={props.onClose} width="100%"
            as={Link} href="/home"
            >
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </>
    );
}