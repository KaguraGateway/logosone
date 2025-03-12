'use client';

import { Center, Spinner } from '@chakra-ui/react';

import { useQueryOrders } from '@/query/getOrders';
import { useQueryProducts } from '@/query/getProducts';
import { toOrderFromProto } from '@/types/Order';
import { Table } from '@/ui/table/Table';
import { TableHeader } from '@/ui/table/TableHader';
import { Tbody } from '@/ui/table/Tbody';
import { TCollectionItem } from '@/ui/table/TCollectionItem';
import { Td } from '@/ui/table/Td';
import { Th } from '@/ui/table/Th';
import { Tr } from '@/ui/table/Tr';

export default function Orders() {
  const { data: ordersData, isLoading: isOrdersLoading } = useQueryOrders();
  const { data: productsData, isLoading: isProductsLoading } = useQueryProducts();

  const isLoading = isOrdersLoading || isProductsLoading;

  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  const orders = ordersData?.orders?.map((order) => {
    return toOrderFromProto(order, productsData?.products?.map((product) => {
      return {
        id: product.productId,
        name: product.productName,
      };
    }) || []);
  }) || [];

  return (
    <div>
      <Table>
        <TableHeader>
          <Th>ID</Th>
          <Th>注文時間</Th>
          <Th>注文タイプ</Th>
          <Th>商品</Th>
          <Th>合計金額</Th>
        </TableHeader>
        <Tbody>
          {orders.map((order) => (
            <TCollectionItem key={order.id}>
              <Tr>
                <Td>{order.id}</Td>
                <Td>{order.orderAt}</Td>
                <Td>{order.orderType === 'EatIn' ? 'イートイン' : 'テイクアウト'}</Td>
                <Td>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.productName} × {item.quantity} ({item.price}円)
                        {item.coffeeBrewId && ` (淹れ方: ${item.coffeeBrewId})`}
                      </li>
                    ))}
                  </ul>
                </Td>
                <Td>{order.totalPrice}円</Td>
              </Tr>
            </TCollectionItem>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}
