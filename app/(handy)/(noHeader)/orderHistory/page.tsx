'use client';
import { Center, Text, Flex, Spinner, Box, VStack } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import { useUnpaidOrdersQuery } from '@/query/getUnpaidOrders';
import { useProductQuery } from '@/query/getProducts';
import { getProductInfo } from '../orderEntry/utils/productUtils';

export default function OrderHistory() {
    const searchParams = useSearchParams();
    const seatId = searchParams.get('seatId');

    const { data: ordersData, error: ordersError, isLoading: ordersLoading } = useUnpaidOrdersQuery(seatId as string);
    const { data: productsData, error: productsError, isLoading: productsLoading } = useProductQuery();

    if (ordersLoading || productsLoading) {
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
                <Text color="red.500">商品情報を取得できませんでした。</Text>
            </Center>
        );
    }

    return (
        <Flex flexDir="column" padding={4}>
            <Text fontSize="2xl" fontWeight="semibold" color="gray.600">
                注文履歴
            </Text>
            {ordersData?.orders.length > 0 ? (
                ordersData.orders.map(order => (
                    <Box key={order.id} borderWidth="1px" borderRadius="lg" padding={4} marginY={2}>
                        <Text fontSize="lg" fontWeight="bold">注文ID: {order.id}</Text>
                        <Text>注文日時: {new Date(order.orderAt).toLocaleString()}</Text>
                        <Text>座席名: {order.seatName || '未指定'}</Text>
                        <Text>商品:</Text>
                        <VStack spacing={2} align="start">
                            {order.items.map(item => {
                                // 商品名と淹れ方の情報を取得
                                const { product, coffeeBrew } = getProductInfo(productsData?.products || [], item.productId, item.coffeeBrewId);
                                return (
                                    <Box key={item.productId} padding={2} borderWidth="1px" borderRadius="md">
                                        <Text>商品名: {product ? product.productName : '不明'}</Text>
                                        <Text>数量: {item.quantity}</Text>
                                        <Text>金額: {item.amount.toString()}円</Text>
                                        {coffeeBrew && <Text>淹れ方: {coffeeBrew.name}</Text>}
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
    );
}
