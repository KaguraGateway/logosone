'use client';
import {
  Box, Button, Flex, Text, Spacer, VStack, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import Link from 'next/link';
import ChooseOptionModal from './_components/ChooseOptionModal';
import { HiCheckCircle } from 'react-icons/hi';

export default function orderEntry() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* 全体 */}
      <Flex flexDir="row" >
        {/* 左 */}
        <Flex flexDir="column" width={3 / 10} alignItems="start" overflow="scroll">
          <Button size="lg" colorScheme="teal" whiteSpace="unset" width="100%" minHeight="80px" height="max-content" padding={1} borderRadius="0" borderY="1px" borderColor="gray.300">
            <Text overflowWrap="anywhere">すべて</Text>
          </Button>
          <Button size="lg" colorScheme="whiteAlpha" whiteSpace="unset" width="100%" minHeight="80px" height="max-content" color="gray.600" padding={1} borderRadius="0" borderY="1px" borderColor="gray.300">
            <Text overflowWrap="anywhere">コーヒー</Text>
          </Button>
          <Button size="lg" colorScheme="whiteAlpha" whiteSpace="unset" width="100%" minHeight="80px" height="max-content" color="gray.600" padding={1} borderRadius="0" borderY="1px" borderColor="gray.300">
            <Text overflowWrap="anywhere">ソフトドリンク</Text>
          </Button>
          <Button size="lg" colorScheme="whiteAlpha" whiteSpace="unset" width="100%" minHeight="80px" height="max-content" color="gray.600" padding={1} borderRadius="0" borderY="1px" borderColor="gray.300">
            <Text overflowWrap="anywhere">その他</Text>
          </Button>
          <Button size="lg" colorScheme="whiteAlpha" whiteSpace="unset" width="100%" minHeight="80px" height="max-content" color="gray.600" padding={1} borderRadius="0" borderY="1px" borderColor="gray.300">
            <Text overflowWrap="anywhere">物販</Text>
          </Button>
        </Flex>
        {/* 右 */}
        <Flex flexDir="column" width={7 / 10} alignItems="start" overflow="scroll" borderLeft="2px" borderColor="gray.300" >
          {/* Category */}
          <Flex flexDir="column" padding={1} width="100%" gap={2}>
            {/* CategoryName */}
            <Text fontSize="xl" fontWeight="semibold" color="gray.600">
              コーヒー
            </Text>
            {/* CategoryItem */}
            <Button size="lg" bg="white" color="gray.600" whiteSpace="unset" width="100%" paddingY={8} boxShadow="base" border="1px" borderColor="gray.300" onClick={onOpen} >
              <Text overflowWrap="anywhere">ロゴスブレンド〜豊穣〜</Text>
            </Button>
            <Button size="lg" bg="white" color="gray.600" whiteSpace="unset" width="100%" paddingY={8} boxShadow="base" border="1px" borderColor="gray.300">
              <Text overflowWrap="anywhere">茜ブレンド</Text>
            </Button>
          </Flex>
          <Flex flexDir="column" padding={1} width="100%" gap={2} paddingTop={2}>
            <Text fontSize="xl" fontWeight="semibold" color="gray.600">
              ソフトドリンク
            </Text>
            <Button size="lg" bg="white" color="gray.600" whiteSpace="unset" width="100%" paddingY={8} boxShadow="base" border="1px" borderColor="gray.300">
              <Text overflowWrap="anywhere">レモネード</Text>
            </Button>
            <Button size="lg" bg="white" color="gray.600" whiteSpace="unset" width="100%" paddingY={8} boxShadow="base" border="1px" borderColor="gray.300">
              <Text overflowWrap="anywhere">レモネードスカッシュ</Text>
            </Button>
            <Button size="lg" bg="white" color="gray.600" whiteSpace="unset" width="100%" paddingY={8} boxShadow="base" border="1px" borderColor="gray.300">
              <Text overflowWrap="anywhere">ヨーグルッペ</Text>
            </Button>
          </Flex>
          <Flex flexDir="column" padding={1} width="100%" gap={2} paddingTop={2}>
            <Text fontSize="xl" fontWeight="semibold" color="gray.600">
              その他
            </Text>
            <Button size="lg" bg="white" color="gray.600" whiteSpace="unset" width="100%" paddingY={8} boxShadow="base" border="1px" borderColor="gray.300">
              <Text overflowWrap="anywhere">薄皮饅頭</Text>
            </Button>
            <Button size="lg" bg="white" color="gray.600" whiteSpace="unset" width="100%" paddingY={8} boxShadow="base" border="1px" borderColor="gray.300">
              <Text overflowWrap="anywhere">チョコレート</Text>
            </Button>
          </Flex>
          <Flex flexDir="column" padding={1} width="100%" gap={2} paddingTop={2}>
            <Text fontSize="xl" fontWeight="semibold" color="gray.600">
              物販
            </Text>
            <Button size="lg" bg="white" color="gray.600" whiteSpace="unset" width="100%" paddingY={8} boxShadow="base" border="1px" borderColor="gray.300">
              <Text overflowWrap="anywhere">（豆）ロゴスブレンド〜豊穣〜</Text>
            </Button>
            <Button size="lg" bg="white" color="gray.600" whiteSpace="unset" width="100%" paddingY={8} boxShadow="base" border="1px" borderColor="gray.300">
              <Text overflowWrap="anywhere">（豆）茜ブレンド</Text>
            </Button>
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
