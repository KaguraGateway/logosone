'use client';
import { useDisclosure } from "@chakra-ui/react";
import { Button, Center, Flex, Text } from "@chakra-ui/react";
import Link from 'next/link';
import ProductInfoCard from "./_components/ProductInfoCard";
import { HiCheckCircle } from "react-icons/hi";
import { IoArrowBackOutline } from "react-icons/io5";
import ErrorModal from "./_components/ErrorModal";

export default function orderCheck() {
    const { isOpen: isOpenErrorModal, onOpen: onOpenErrorModal, onClose: onCloseErrorModal } = useDisclosure();
    return (
    <>  
        <Center>
            <Text fontSize="2xl" fontWeight="semibold" color="gray.600"  p={4} >
                注文確認
            </Text>
        </Center>
        <Flex flexDir="column" padding={1} width="100%" gap={4} paddingX={4}>
            <ProductInfoCard name="ロゴスブレンド〜豊穣〜（ネル）" quantity={2} />
            <ProductInfoCard name="茜ブレンド（サイフォン）" quantity={1} />
            <ProductInfoCard name="レモネード" quantity={1} />
        </Flex>
        <Flex flexDir="row"  position="fixed" width="100vw" alignItems="center" bottom="0" left="0" right="0" minHeight="70px" bg="white" paddingTop={3} paddingBottom={5} borderTop="2px" borderColor="gray.300" boxShadow="base" paddingX={4}>
            <Button flex={1} size="lg" colorScheme="red" leftIcon={<IoArrowBackOutline />}  marginRight={4}
            as={Link} href="/orderEntry">
                戻る
            </Button>
            <Button flex={3} size="lg" colorScheme="green" leftIcon={<HiCheckCircle />} 
            onClick={onOpenErrorModal}
            // as={Link} href="/waiter"
            >
                注文送信
            </Button>
        </Flex>

        <ErrorModal
            isOpen={isOpenErrorModal}
            onClose={onCloseErrorModal}
            onOpen={onOpenErrorModal}
            errorTitle="注文送信エラー"
            errorMessage="注文を送信できませんでした。"
        />
    </>
  );
}