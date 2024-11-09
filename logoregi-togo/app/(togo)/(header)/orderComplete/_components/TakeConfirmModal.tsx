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
import Link from 'next/link';
import React from 'react';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
};

export default function TakeConfirmModal(props: Props) {
    return (
        <>
            {/* モーダル */}
            <Modal closeOnOverlayClick={false} isOpen={props.isOpen} onClose={props.onClose}>
                <ModalOverlay/>
                <ModalContent bg="white">
                    <ModalHeader>受け取りを完了しますか？</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody pb={6}>
                        {/* モーダル内のコンテンツ */}
                        <Flex flexDir="column" gap={3}>
                            この操作は取り消せません。
                            <br/>
                            本当に商品を受け取りましたか？
                            <Spacer/>
                        </Flex>
                    </ModalBody>

                    <ModalFooter>
                        {/* モーダル内での操作ボタン */}
                        <Button colorScheme="gray" mr={3} onClick={props.onClose} width="100%">
                            キャンセル
                        </Button>
                        <Button colorScheme="orange" mr={3} onClick={props.onClose} width="100%" as={Link} href="/home">
                            受け取り完了
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
