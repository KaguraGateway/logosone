'use client';

import { Button, Flex, HStack, Text } from '@chakra-ui/react';
import { BiCoffeeTogo } from 'react-icons/bi';
import { FiCoffee } from 'react-icons/fi';
import { FiCheckSquare } from 'react-icons/fi';

import { useStaff } from '@/app/(base)/(coreapp)/staff/use';
import { useProduct } from '@/jotai/product';
import { ElapsedMinTime } from '@/ui/ElapsedMinTime';
import { HeaderBase } from '@/ui/HeaderBase';
import { MainBox } from '@/ui/MainBox';
import { type OrderItemStatus, OrderItemStatusEnum } from '@/zod/order_items';
import { type OrderStatus, OrderStatusEnum, type OrderType, OrderTypeEnum } from '@/zod/orders';

import { FilterModal } from './_components/FilterModal';
import { ItemCard } from './_components/ItemCard';

function fromOrderType(orderType: OrderType): 'takeout' | 'eat-in' {
  switch (orderType) {
    case OrderTypeEnum.EatIn:
      return 'eat-in';
    case OrderTypeEnum.TakeOut:
      return 'takeout';
  }
}
function fromOrderStatus(itemStatus: OrderStatus): 'cooking' | 'calling' | 'provided' {
  switch (itemStatus) {
    case OrderStatusEnum.NotYet:
    case OrderStatusEnum.Cooking:
    case OrderStatusEnum.Cooked:
      return 'cooking';
    case OrderStatusEnum.Calling:
      return 'calling';
    case OrderStatusEnum.Provided:
      return 'provided';
  }
}
function fromItemStatus(itemStatus: OrderItemStatus): 'notyet' | 'done' {
  switch (itemStatus) {
    case OrderItemStatusEnum.NotYet:
    case OrderItemStatusEnum.Cooking:
      return 'notyet';
    case OrderItemStatusEnum.Cooked:
      return 'done';
  }
}

export default function StaffPage() {
  const {
    cookedOrdersLen,
    cookingOrdersLen,
    notYetOrdersLen,
    isOpenFilterModal,
    onOpenFilterModal,
    onCloseFilterModal,
    onConfirmFilterModal,
    onAllEatInOnly,
    onAllTakeoutOnly,
    onAllProvidedOnly,
    filteredOrders,
    staffFilter,
    onCall,
    onCancelCall,
    onProvided,
  } = useStaff();
  const { getProductByProductId, getCoffeeBrew } = useProduct();

  return (
    <>
      <HeaderBase name="スタッフ">
        <HStack spacing={{ base: '1', md: '2' }}>
          <Button
            size={{ base: 'md', md: 'lg' }}
            colorScheme="gray"
            bg="gray.400"
            color="white"
            leftIcon={<FiCheckSquare />}
            fontSize={{ base: 'xs', md: 'sm' }}
            textAlign="left"
            onClick={onAllProvidedOnly}
            px={{ base: '2', md: '4' }}
          >
            提供済
            <br />
            表示
          </Button>
          <Button
            size={{ base: 'md', md: 'lg' }}
            colorScheme="orange"
            bg="orange.500"
            leftIcon={<BiCoffeeTogo />}
            fontSize={{ base: 'xs', md: 'sm' }}
            textAlign="left"
            onClick={onAllTakeoutOnly}
            px={{ base: '2', md: '4' }}
          >
            テイクアウト
            <br />
            全件表示
          </Button>
          <Button
            size={{ base: 'md', md: 'lg' }}
            colorScheme="teal"
            bg="teal.500"
            leftIcon={<FiCoffee />}
            fontSize={{ base: 'xs', md: 'sm' }}
            textAlign="left"
            onClick={onAllEatInOnly}
            px={{ base: '2', md: '4' }}
          >
            イートイン
            <br />
            全件表示
          </Button>
          <Button
            size={{ base: 'md', md: 'lg' }}
            colorScheme="blue"
            bg="blue.500"
            leftIcon={<FiCheckSquare />}
            fontSize={{ base: 'xs', md: 'sm' }}
            textAlign="left"
            onClick={onOpenFilterModal}
            px={{ base: '2', md: '4' }}
          >
            高度な
            <br />
            絞り込み
          </Button>
        </HStack>
      </HeaderBase>
      <MainBox>
        <Flex
          py={{ base: '12px', md: '16px' }}
          alignItems="center"
          justifyContent="center"
          flexWrap={{ base: 'wrap', md: 'nowrap' }}
        >
          <Text
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="semibold"
            color="blue.500"
            mr={{ base: '4', md: '8' }}
            mb={{ base: '2', md: '0' }}
          >
            提供可能: {cookedOrdersLen}
          </Text>
          <Text
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="semibold"
            color="orange.700"
            mr={{ base: '4', md: '8' }}
            mb={{ base: '2', md: '0' }}
          >
            調理中: {cookingOrdersLen}
          </Text>
          <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="semibold" color="gray.600">
            未調理: {notYetOrdersLen}
          </Text>
        </Flex>
        <Flex
          alignItems="flex-start"
          flexWrap="wrap"
          justifyContent={{ base: 'center', md: 'flex-start' }}
          mx={{ base: '-8px', md: '0' }}
        >
          {filteredOrders.map((order) => (
            <ItemCard
              key={order.OrderId}
              callNumber={order.TicketAddr}
              seatNumber={order.SeatName}
              waitingTime={<ElapsedMinTime dateISO={order.OrderAt} />}
              type={fromOrderType(order.OrderType)}
              status={fromOrderStatus(order.Status)}
              onCall={() => onCall(order.OrderId)}
              onCancelCall={() => onCancelCall(order.OrderId)}
              onProvided={() => onProvided(order.OrderId)}
              items={order.OrderItems.map((item) => {
                const product = getProductByProductId(item.ProductId);
                return {
                  productId: `${item.ProductId}${item.CoffeeBrewId}`,
                  productName: `${product?.productName}${
                    item.CoffeeBrewId ? `(${getCoffeeBrew(item.CoffeeBrewId)?.name})` : ''
                  }`,
                  productColor: product?.productColor ?? 'blue.500',
                  itemId: item.Id,
                  status: fromItemStatus(item.Status),
                };
              })}
            />
          ))}
        </Flex>
      </MainBox>
      <FilterModal
        isOpen={isOpenFilterModal}
        onClose={onCloseFilterModal}
        filter={staffFilter}
        onConfirm={onConfirmFilterModal}
      />
    </>
  );
}
