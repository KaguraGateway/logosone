'use client';
import {Alert, AlertIcon, Box, Button, Flex, Text, useDisclosure} from '@chakra-ui/react';
import {BiCoffeeTogo, BiLogOut} from 'react-icons/bi';

import {useSeatQuery} from '@/query/getSeats';

import TakeConfirmModal from './_components/TakeConfirmModal';

export default function OrderComplete({searchParams}: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const {isOpen: isOpenTakeConfirmModal, onOpen: onOpenTakeConfirmModal, onClose: onCloseTakeConfirmModal} = useDisclosure();
    const seatQuery = useSeatQuery(); // 座席情報を取得

    return (
        <>
            <Flex flexDir="column" gap="26px" marginBottom={100}>
                {searchParams.isSendSuccess != null && Boolean(searchParams.isSendSuccess) && (
                    <Alert status="success">
                        <AlertIcon/>
                        注文を送信しました
                    </Alert>
                )}
                {searchParams.callNumber != null && (
                    <Flex bg="gray.50" flexDir="column" alignItems="center" p={4}>
                        <Text color="gray.600" fontSize="4xl" fontWeight="bold">{searchParams.callNumber}</Text>
                        <Flex
                            bg='orange.500'
                            color="white"
                            alignItems="center"
                            fontStyle="semibold"
                            borderRadius="md"
                            px={1}
                            py={0.5}
                        >
                            <Box mr="0.5"><BiCoffeeTogo /></Box>
                            テイクアウト
                        </Flex>
                    </Flex>
                )}
                <Text fontSize="lg" fontWeight="bold">調理状況は引換券モニターをご覧ください</Text>
                <Flex
                    flexDir="column"
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
                    <Button size="lg" colorScheme="red" leftIcon={<BiLogOut/>} width={'100%'}
                            onClick={onOpenTakeConfirmModal}>
                        受け取り完了
                    </Button>
                </Flex>
            </Flex>
            <TakeConfirmModal isOpen={isOpenTakeConfirmModal} onClose={onCloseTakeConfirmModal} onOpen={onOpenTakeConfirmModal}/>
        </>
    );
}
