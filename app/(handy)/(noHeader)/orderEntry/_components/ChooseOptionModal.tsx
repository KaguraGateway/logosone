import React from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Text, useDisclosure, Flex, Spacer, HStack, Badge} from '@chakra-ui/react';
import { DeleteIcon, MinusIcon, AddIcon } from '@chakra-ui/icons';
import QuantitySelector from './QuantitySelector';
import ProductInfoButton from './ProductInfoButton';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
  }

export default function ChooseOptionModal(props: Props) {
  return (
    <>
      {/* モーダル */}
      <Modal closeOnOverlayClick={false} isOpen={props.isOpen} onClose={props.onClose} >
        <ModalOverlay />
        <ModalContent bg="gray.100">
          <ModalHeader>ドリップ方法を選択</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* モーダル内のコンテンツ */}
            <Flex flexDir="column" gap={3}>
                <Flex flexDir="column" gap={3}>
                    <Button size="lg" bg="white" color="gray.600" whiteSpace="unset" width="100%" paddingY={8} boxShadow="base" border="1px" borderColor="gray.300" justifyContent="flex-start" >
                        
                        <Flex flexDir="row" width="100%">
                            <Text overflowWrap="anywhere">ペーパー</Text>
                            <Spacer />
                            <Badge colorScheme='green'>
                                <Text fontSize="lg">1</Text>
                            </Badge>
                        </Flex>
                    </Button>
                <QuantitySelector quantity={0} onQuantityChange={() => {}} />
                <ProductInfoButton name="サザエ" quantity={100000000000000000000000} />
                <ProductInfoButton name="アツアツ" quantity={0} />
            </Flex>
            <Button size="lg" bg="white" color="gray.600" whiteSpace="unset" width="100%" paddingY={8} boxShadow="base" border="1px" borderColor="gray.300" justifyContent="flex-start" >
              <Text overflowWrap="anywhere">ネル</Text>
            </Button>
            <Button size="lg" bg="white" color="gray.600" whiteSpace="unset" width="100%" paddingY={8} boxShadow="base" border="1px" borderColor="gray.300" justifyContent="flex-start" >
              <Text overflowWrap="anywhere">サイフォン</Text>
            </Button>
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
