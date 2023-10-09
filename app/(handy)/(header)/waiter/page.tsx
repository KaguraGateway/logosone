'use client';
import { Alert, AlertIcon, Button, Flex, Grid, Text, useDisclosure } from "@chakra-ui/react";
import { IoClipboard } from 'react-icons/io5';
import { BiLogOut } from "react-icons/bi";
import Link from 'next/link';
import WorkEndModal from "./_components/WorkEndModal";
import { on } from "events";
import TicketSelectButton from "./_components/TicketSelectButton";


export default function Waiter() {
    const { isOpen: isOpenWorkEndModal, onOpen: onOpenWorkEndModal, onClose: onCloseWorkEndModal } = useDisclosure();
    return (
        <>
        
        <Flex flexDir="column" gap="26px" paddingBottom={100}>

            {/* ここに注文送信成功のアラートを表示したい */}
            {/* <Alert status='success'>
            <AlertIcon />
                注文を送信しました
            </Alert> */} 

            <Button as={Link} href="../orderEntry" size="lg" colorScheme="teal" h="100px" leftIcon={<IoClipboard />}>
                注文入力
            </Button>
            <Button size="lg" colorScheme="gray" h="100px" leftIcon={<IoClipboard />} bg="gray.500" color="gray.50">
                {/* OrderLink Staffに遷移 */}
                配膳管理
                <br />
                (OrderLinkスタッフ)
            </Button>
            <Flex flexDir="column" gap="3">
                <Text fontSize="xl" fontWeight="semibold" color="gray.600">
                    テーブル
                </Text>
                <Grid templateColumns='repeat(3, 1fr)' gap="17px">
                    {/* コンポーネントにどうやってリンク設定するか迷ったけど、どんな仕様かわからないので一旦なしで。一番上は遷移のサンプル*/}
                    <Button size="lg" colorScheme="gray" h={16} bg="gray.50" color="gray.600" shadow="base" fontSize="xl" as={Link} href={"./orderHistory"}>
                        1
                    </Button>
                    <TicketSelectButton id={1} number={2} />
                    <TicketSelectButton id={1} number={3} />
                    <TicketSelectButton id={1} number={4} />
                    <TicketSelectButton id={1} number={5} />
                    <TicketSelectButton id={1} number={6} />
                </Grid>
                <Text fontSize="xl" fontWeight="semibold" color="gray.600">
                    カウンター
                </Text>
                <Grid templateColumns='repeat(3, 1fr)' gap="17px">
                    <TicketSelectButton id={2} number={1} />
                    <TicketSelectButton id={2} number={2} />
                    <TicketSelectButton id={2} number={3} />
                    <TicketSelectButton id={2} number={4} />
                    <TicketSelectButton id={2} number={5} />
                    <TicketSelectButton id={2} number={6} />
                </Grid>
            </Flex>
            <Flex flexDir="column"  position="fixed" width="100vw" alignItems="center" bottom="0" left="0" right="0" minHeight="70px" bg="white" paddingTop={3} paddingBottom={5} borderTop="2px" borderColor="gray.300" boxShadow="base" paddingX={4}>
                <Button size="lg" colorScheme="orange" leftIcon={<BiLogOut />} width={"100%"} onClick={onOpenWorkEndModal}>
                    ホールを終了する
                </Button>
            </Flex>
        </Flex>
        <WorkEndModal
            isOpen={isOpenWorkEndModal}
            onClose={onCloseWorkEndModal}
            onOpen={onOpenWorkEndModal}
        />
        
        </>

    );
}
