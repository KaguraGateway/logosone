'use client';
import { Alert, AlertIcon, Button, Flex, Grid, Text, useDisclosure } from '@chakra-ui/react';
import Link from 'next/link';
import { BiLogOut } from 'react-icons/bi';
import { IoClipboard } from 'react-icons/io5';

import { useSeatQuery } from '@/query/getSeats';

import TicketSelectButton from './_components/TicketSelectButton';
import WorkEndModal from './_components/WorkEndModal';

export default function Waiter({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const { isOpen: isOpenWorkEndModal, onOpen: onOpenWorkEndModal, onClose: onCloseWorkEndModal } = useDisclosure();
  const seatQuery = useSeatQuery(); // 座席情報を取得

  return (
    <>
      <Flex flexDir="column" gap="26px" marginBottom={100}>
        {searchParams.isSendSuccess != null && Boolean(searchParams.isSendSuccess) && (
          <Alert status="success">
            <AlertIcon />
            注文を送信しました
          </Alert>
        )}

        <Button as={Link} href="../orderEntry" size="lg" colorScheme="orange" h="100px" leftIcon={<IoClipboard />} bg={"orange.700"}>
          注文入力
        </Button>
        <Flex flexDir="column" gap="3">
        <Text fontSize="xl" fontWeight="semibold" color="gray.600">
          テーブル
        </Text>
        <Grid templateColumns="repeat(3, 1fr)" gap="17px">
          {/* テーブルの座席ボタンを動的に生成 */}
          {seatQuery.data?.seats
            .filter(seat => seat.name.startsWith('テーブル')) // カウンターの座席をフィルタリング
            .map(seat => (
              <Link key={seat.id} href={`/orderHistory?seatId=${seat.id}`} passHref>
                <TicketSelectButton 
                  id={seat.id} 
                  title={seat.name.replace('テーブル', '')} 
                />
              </Link>
            ))}
        </Grid>
        
        <Text fontSize="xl" fontWeight="semibold" color="gray.600">
          カウンター
        </Text>
        <Grid templateColumns="repeat(3, 1fr)" gap="17px">
          {/* カウンターの座席ボタンを動的に生成 */}
          {seatQuery.data?.seats
            .filter(seat => seat.name.startsWith('カウンター')) // カウンターの座席をフィルタリング
            .map(seat => (
              <Link key={seat.id} href={`/orderHistory?seatId=${seat.id}`} passHref>
                <TicketSelectButton 
                  id={seat.id} 
                  title={seat.name.replace('カウンター', '')} 
                />
              </Link>
            ))}
        </Grid>

        <Text fontSize="xl" fontWeight="semibold" color="gray.600">
          その他
        </Text>
        <Grid templateColumns="repeat(3, 1fr)" gap="17px">
          {/* その他の座席ボタンを動的に生成 */}
          {seatQuery.data?.seats
            .filter(seat => !seat.name.startsWith('テーブル') && !seat.name.startsWith('カウンター')) // その他の座席をフィルタリング
            .map(seat => (
              <Link key={seat.id} href={`/orderHistory?seatId=${seat.id}`} passHref>
                <TicketSelectButton 
                  id={seat.id} 
                  title={seat.name} 
                />
              </Link>
            ))}
        </Grid>
      </Flex>
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
          <Button size="lg" colorScheme="red" leftIcon={<BiLogOut />} width={'100%'} onClick={onOpenWorkEndModal}>
            ホールを終了する
          </Button>
        </Flex>
      </Flex>
      <WorkEndModal isOpen={isOpenWorkEndModal} onClose={onCloseWorkEndModal} onOpen={onOpenWorkEndModal} />
    </>
  );
}
