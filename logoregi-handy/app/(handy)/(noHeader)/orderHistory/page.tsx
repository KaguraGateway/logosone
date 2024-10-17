'use client';
import { Box, Button,Center, Flex, HStack, Spacer, Spinner, Text, VStack} from '@chakra-ui/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { IoArrowBackOutline, IoClipboard } from 'react-icons/io5';

import { useProductQuery } from '@/query/getProducts';
import { useSeatQuery } from '@/query/getSeats';
import { useUnpaidOrdersQuery } from '@/query/getUnpaidOrders';

import { getProductInfo } from '../orderEntry/utils/productUtils';

export default function OrderHistory() {
    const searchParams = useSearchParams();
    const seatId = searchParams.get('seatId');

    const { data: ordersData, error: ordersError, isLoading: ordersLoading } = useUnpaidOrdersQuery(seatId as string);
    const { data: productsData, error: productsError, isLoading: productsLoading } = useProductQuery();
    const seatQuery = useSeatQuery();

    if (ordersLoading || productsLoading || seatQuery.isLoading) {
        return (
            <Center>
                <Spinner />
            </Center>
        );
    }

    if (ordersError) {
        return (
            <Center>
                <Text color="red.500">未払いの注文を取得できませんでした。</Text>
            </Center>
        );
    }

    if (productsError) {
        return (
            <Center>
                <Text color="red.500">商品情報を取得できませんした。</Text>
            </Center>
        );
    }

    if (seatQuery.error) {
        return (
            <Center>
                <Text color="red.500">座席情報を取得できませんでした。</Text>
            </Center>
        );
    }

    const getSeatName = (seatId: string) => {
        const seat = seatQuery.data?.seats.find(seat => seat.id === seatId);
        return seat ? seat.name : '未指定';
    };

    // 合計金額を計算
    const totalAmount = ordersData?.orders.reduce((total, order) => {
        return total + order.items.reduce((orderTotal, item) => {
            return orderTotal + Number(item.amount) * item.quantity; // 各アイテムの金額を数量で掛け算
        }, 0);
    }, 0) || 0;

    return (
      <>
        <Flex flexDir="column" padding={4} marginBottom={70}>
          <HStack>
            <Text fontSize="2xl" fontWeight="semibold" color="gray.600">
                注文履歴
            </Text>
            <Spacer />
            <Text fontSize="xl" fontWeight="semibold" color="gray.600">
              {getSeatName(seatId as string)}
            </Text>
          </HStack>
          <Text fontSize="xl" fontWeight="bold" color="gray.800" marginTop={4}>
                合計金額: ¥{totalAmount.toString()}
          </Text>
            {ordersData?.orders.length > 0 ? (
                ordersData.orders.map(order => (
                    <Box key={order.id} borderWidth="1px" borderRadius="lg" padding={4} marginY={2} bg={"white"}>
                        <Text fontSize="lg" fontWeight="bold">注文日時: {new Date(order.orderAt).toLocaleString()}</Text>
                        <Text >注文ID: {order.id}</Text>
                        <VStack spacing={2} align="start">
                            {order.items.map(item => {
                                const { product, coffeeBrew } = getProductInfo(productsData?.products || [], item.productId, item.coffeeBrewId);
                                return (
                                    <Box key={item.productId} padding={2} borderWidth="1px" borderRadius="md" width="100%">
                                        <HStack>
                                          <VStack align="start">
                                            <HStack fontWeight={'bold'} >
                                                <Text>{product ? product.productName : '不明'}</Text>
                                                {coffeeBrew && <Text>({coffeeBrew.name})</Text>}
                                            </HStack>
                                            <Text>{item.quantity}点</Text>
                                          </VStack>
                                          <Spacer />
                                          <Text fontWeight={'bold'} fontSize={'lg'}>¥{item.amount.toString()}</Text>
                                        </HStack>
                                        
                                    </Box>
                                );
                            })}
                        </VStack>
                    </Box>
                ))
            ) : (
                <Text color="gray.500">未支払いの注文はありません。</Text>
            )}
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
          colorScheme="gray"
          leftIcon={<IoArrowBackOutline />}
          marginRight={4}
          bg={'gray.300'}
          as={Link}
          href="/waiter"
        >
          戻る
        </Button>
        <Button flex={3} size="lg" colorScheme="blue" leftIcon={<IoClipboard />} as={Link} href={`/orderEntry?seatId=${seatId}`}>
          追加注文
        </Button>
        </Flex>
      </>
    );
}
