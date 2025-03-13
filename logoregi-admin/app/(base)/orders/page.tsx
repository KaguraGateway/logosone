'use client';

import { useState, useMemo } from 'react';
import { Center, Spinner } from '@chakra-ui/react';

import { useQueryOrders } from '@/query/getOrders';
import { useQueryProducts } from '@/query/getProducts';
import { toOrderFromProto } from '@/types/Order';
import { toProductFromProto } from "@/types/Product";
import { Table } from '@/ui/table/Table';
import { TableHeader } from '@/ui/table/TableHader';
import { Tbody } from '@/ui/table/Tbody';
import { TCollectionItem } from '@/ui/table/TCollectionItem';
import { Td } from '@/ui/table/Td';
import { Th } from '@/ui/table/Th';
import { Tr } from '@/ui/table/Tr';
import { FilterSortBar } from './_components/FilterSortBar';

type SortType = 'orderTime' | 'totalAmount';
type SortDirection = 'asc' | 'desc';

export default function Orders() {
  const { data: ordersData, isLoading: isOrdersLoading } = useQueryOrders();
  const { data: productsData, isLoading: isProductsLoading } = useQueryProducts();
  
  const [orderTimeDirection, setOrderTimeDirection] = useState<SortDirection>('desc');
  const [totalAmountDirection, setTotalAmountDirection] = useState<SortDirection>('desc');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeSortType, setActiveSortType] = useState<SortType>('orderTime');

  const isLoading = isOrdersLoading || isProductsLoading;

  const products = useMemo(() => {
    return productsData?.products?.map((product) => toProductFromProto(product)) || [];
  }, [productsData]);

  const orders = useMemo(() => {
    if (!ordersData?.orders) return [];
    
    let result = ordersData.orders.map((order) => {
      return toOrderFromProto(order, products);
    });
    
    // 商品でフィルタリング
    if (selectedProductId) {
      result = result.filter(order => 
        order.items.some(item => item.productId === selectedProductId)
      );
    }
    
    // ソート
    if (activeSortType === 'orderTime') {
      result.sort((a, b) => {
        const dateA = new Date(a.orderAt).getTime();
        const dateB = new Date(b.orderAt).getTime();
        return orderTimeDirection === 'asc' ? dateA - dateB : dateB - dateA;
      });
    } else if (activeSortType === 'totalAmount') {
      result.sort((a, b) => {
        return totalAmountDirection === 'asc' 
          ? a.totalAmount - b.totalAmount 
          : b.totalAmount - a.totalAmount;
      });
    }
    
    return result;
  }, [ordersData, products, selectedProductId, activeSortType, orderTimeDirection, totalAmountDirection]);

  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <div>
      <FilterSortBar
        products={products}
        orderTimeDirection={orderTimeDirection}
        onOrderTimeDirectionChange={setOrderTimeDirection}
        totalAmountDirection={totalAmountDirection}
        onTotalAmountDirectionChange={setTotalAmountDirection}
        selectedProductId={selectedProductId}
        onSelectedProductIdChange={setSelectedProductId}
        activeSortType={activeSortType}
        onActiveSortTypeChange={setActiveSortType}
      />
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
