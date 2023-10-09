'use client';
import {
  Box, Button, Flex, Text, Spacer, VStack, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VisuallyHidden
} from '@chakra-ui/react';
import Link from 'next/link';
import ChooseOptionModal from './_components/ChooseOptionModal';
import { HiCheckCircle } from 'react-icons/hi';
import CategorySelectButton from './_components/CategorySelectButton';
import ProductInfoButton from './_components/ProductInfoButton';
import ProductQuantityControl from './_components/ProductQuantityControl';

export default function orderEntry() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* 全体 */}
      <Flex flexDir="row" >
        {/* 左 */}
        <Flex flexDir="column" width={3 / 10} alignItems="start" overflow="scroll">
          <CategorySelectButton name="すべて" isSelected ={true} />
          <CategorySelectButton name="コーヒー" isSelected ={false} />
          <CategorySelectButton name="ソフトドリンク" isSelected ={false} />
          <CategorySelectButton name="その他" isSelected ={false} />
          <CategorySelectButton name="物販" isSelected ={false} />
        </Flex>
        {/* 右 */}
        <Flex flexDir="column" width={7 / 10} alignItems="start" overflow="scroll" borderLeft="2px" borderColor="gray.300" paddingBottom={100}>
          {/* Category */}
          <Flex flexDir="column" padding={1} width="100%" gap={2}>
            {/* CategoryName */}
            <Text fontSize="xl" fontWeight="semibold" color="gray.600">
              コーヒー
            </Text>
            {/* CategoryItem */}
            <ProductInfoButton name="ロゴスブレンド〜豊穣〜" quantity={0} onClick={onOpen} />
            <ProductInfoButton name="茜ブレンド" quantity={0} onClick={onOpen} />
          </Flex>
          <Flex flexDir="column" padding={1} width="100%" gap={2} paddingTop={2}>
            <Text fontSize="xl" fontWeight="semibold" color="gray.600">
              ソフトドリンク
            </Text>
            <ProductQuantityControl name="レモネード" quantity={0} onQuantityChange={() => {}} />
            <ProductQuantityControl name="レモネードスカッシュ" quantity={0} onQuantityChange={() => {}} />
            <ProductQuantityControl name="ヨーグルッペ" quantity={0} onQuantityChange={() => {}} />
          </Flex>
          <Flex flexDir="column" padding={1} width="100%" gap={2} paddingTop={2}>
            <Text fontSize="xl" fontWeight="semibold" color="gray.600">
              その他
            </Text>
            <ProductQuantityControl name="薄皮饅頭" quantity={0} onQuantityChange={() => {}} />
            <ProductQuantityControl name="チョコレート" quantity={0} onQuantityChange={() => {}} />
          </Flex>
          <Flex flexDir="column" padding={1} width="100%" gap={2} paddingTop={2}>
            <Text fontSize="xl" fontWeight="semibold" color="gray.600">
              物販
            </Text>
            <ProductQuantityControl name="（豆）ロゴスブレンド〜豊穣〜" quantity={0} onQuantityChange={() => {}} />
            <ProductQuantityControl name="（豆）茜ブレンド" quantity={0} onQuantityChange={() => {}} />
          </Flex>
          <ChooseOptionModal
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
          />
        </Flex>
      </Flex>
      <Flex flexDir="column"  position="fixed" width="100vw" alignItems="center" bottom="0" left="0" right="0" minHeight="70px" bg="white" paddingTop={2} paddingBottom={5} borderTop="2px" borderColor="gray.300" boxShadow="base">
        <Button size="lg" colorScheme="green" leftIcon={<HiCheckCircle />} width="90%">
          注文確認
        </Button>
      </Flex>
    </>
  );
}
