'use client';
import {
  Button,
  Flex,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { HiCheckCircle } from 'react-icons/hi';
import { IoArrowBackOutline } from 'react-icons/io5';

import CategorySelectButton from './_components/CategorySelectButton';
import ChooseOptionModal from './_components/ChooseOptionModal';
import ProductInfoButton from './_components/ProductInfoButton';
import ProductQuantityControl from './_components/ProductQuantityControl';
import TicketNumberInputModal from './_components/TicketNumberInputModal';

export default function OrderEntry() {
  const {
    isOpen: isOpenChooseOptionModal,
    onOpen: onOpenChooseOptionModal,
    onClose: onCloseChooseOptionModal,
  } = useDisclosure();
  const {
    isOpen: isOpenTicketNumberInputModal,
    onOpen: onOpenTicketNumberInputModal,
    onClose: onCloseTicketNumberInputModal,
  } = useDisclosure({
    defaultIsOpen: true, // この行を追加して初期値をtrueに設定
  });

  return (
    <>
      {/* 全体 */}
      <Flex flexDir="row">
        {/* 左 */}
        <Flex flexDir="column" width={3 / 10} alignItems="start" overflow="scroll">
          <CategorySelectButton name="すべて" isSelected={true} />
          <CategorySelectButton name="コーヒー" isSelected={false} />
          <CategorySelectButton name="ソフトドリンク" isSelected={false} />
          <CategorySelectButton name="その他" isSelected={false} />
          <CategorySelectButton name="物販" isSelected={false} />
        </Flex>
        {/* 右 */}
        <Flex
          flexDir="column"
          width={7 / 10}
          alignItems="start"
          overflow="scroll"
          borderLeft="2px"
          borderColor="gray.300"
          paddingBottom={100}
        >
          {/* Category */}
          <Flex flexDir="column" padding={1} width="100%" gap={2}>
            {/* CategoryName */}
            <Text fontSize="xl" fontWeight="semibold" color="gray.600">
              コーヒー
            </Text>
            {/* CategoryItem */}
            <ProductInfoButton name="ロゴスブレンド〜豊穣〜" quantity={0} onClick={onOpenChooseOptionModal} />
            <ProductInfoButton name="茜ブレンド" quantity={0} onClick={onOpenChooseOptionModal} />
          </Flex>
          <Flex flexDir="column" padding={1} width="100%" gap={2} paddingTop={2}>
            <Text fontSize="xl" fontWeight="semibold" color="gray.600">
              ソフトドリンク
            </Text>
            <ProductQuantityControl name="レモネード" quantity={0} onQuantityChange={() => {}} />
            <ProductQuantityControl name="レモネードスカッシュ" quantity={0} onQuantityChange={() => {}} />
            <ProductQuantityControl name="ヨーグルッペ" quantity={0} onQuantityChange={() => {}} stock={48} />
          </Flex>
          <Flex flexDir="column" padding={1} width="100%" gap={2} paddingTop={2}>
            <Text fontSize="xl" fontWeight="semibold" color="gray.600">
              その他
            </Text>
            <ProductQuantityControl name="薄皮饅頭" quantity={0} onQuantityChange={() => {}} stock={3} />
            <ProductQuantityControl name="チョコレート" quantity={0} onQuantityChange={() => {}} stock={500} />
          </Flex>
          <Flex flexDir="column" padding={1} width="100%" gap={2} paddingTop={2}>
            <Text fontSize="xl" fontWeight="semibold" color="gray.600">
              物販
            </Text>
            <ProductQuantityControl
              name="(豆)ロゴスブレンド〜豊穣〜"
              quantity={0}
              onQuantityChange={() => {}}
              stock={0}
            />
            <ProductQuantityControl name="(豆)茜ブレンド" quantity={0} onQuantityChange={() => {}} stock={5} />
          </Flex>
          <ChooseOptionModal
            isOpen={isOpenChooseOptionModal}
            onClose={onCloseChooseOptionModal}
            onOpen={onOpenChooseOptionModal}
          />
          <TicketNumberInputModal
            isOpen={isOpenTicketNumberInputModal}
            onClose={onCloseTicketNumberInputModal}
            onOpen={onOpenTicketNumberInputModal}
          />
        </Flex>
      </Flex>

      <Flex
        flexDir="row"
        position="fixed"
        width="100vw"
        alignItems="center"
        bottom="0"
        left="0"
        right="0"
        minHeight="70px"
        bg="white"
        paddingTop={3}
        paddingBottom={5}
        borderTop="2px"
        borderColor="gray.300"
        boxShadow="base"
        paddingX={4}
      >
        <Button
          flex={1}
          size="lg"
          colorScheme="red"
          leftIcon={<IoArrowBackOutline />}
          marginRight={4}
          as={Link}
          href="/waiter"
        >
          戻る
        </Button>
        <Button flex={3} size="lg" colorScheme="green" leftIcon={<HiCheckCircle />} as={Link} href="/orderCheck">
          注文確認
        </Button>
      </Flex>
    </>
  );
}
