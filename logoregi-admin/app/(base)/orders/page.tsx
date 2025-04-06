'use client';

import { Center, Spinner } from '@chakra-ui/react';
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

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
import { toProductFromProto } from "@/types/Product";

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
    return toOrderFromProto(order, productsData?.products?.map((product) => toProductFromProto(product)) || []);
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
                <Td>{format(toZonedTime(parseISO(order.orderAt), 'Asia/Tokyo'), 'yyyy年MM月dd日 HH時mm分ss秒')}</Td>
                <Td>{order.orderType === 'EatIn' ? 'イートイン' : 'テイクアウト'}</Td>
                <Td>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.productName} × {item.quantity} ({item.amount}円)
                        {item.coffeeBrewId && ` (淹れ方: ${item.coffeeBrewName})`}
                      </li>
                    ))}
                  </ul>
                </Td>
                <Td>{order.totalAmount}円</Td>
              </Tr>
            </TCollectionItem>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}
