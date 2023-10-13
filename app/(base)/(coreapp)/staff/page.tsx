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
import { OrderItemStatus, OrderItemStatusEnum } from '@/zod/order_items';
import { OrderStatus, OrderStatusEnum, OrderType, OrderTypeEnum } from '@/zod/orders';

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
        <HStack>
          <Button
            size="lg"
            colorScheme="gray"
            bg="gray.400"
            color="white"
            leftIcon={<FiCheckSquare />}
            fontSize="sm"
            textAlign="left"
            onClick={onAllProvidedOnly}
          >
            提供済
            <br />
            表示
          </Button>
          <Button
            size="lg"
            colorScheme="orange"
            bg="orange.500"
            leftIcon={<BiCoffeeTogo />}
            fontSize="sm"
            textAlign="left"
            onClick={onAllTakeoutOnly}
          >
            テイクアウト
            <br />
            全件表示
          </Button>
          <Button
            size="lg"
            colorScheme="teal"
            bg="teal.500"
            leftIcon={<FiCoffee />}
            fontSize="sm"
            textAlign="left"
            onClick={onAllEatInOnly}
          >
            イートイン
            <br />
            全件表示
          </Button>
          <Button
            size="lg"
            colorScheme="blue"
            bg="blue.500"
            leftIcon={<FiCheckSquare />}
            fontSize="sm"
            textAlign="left"
            onClick={onOpenFilterModal}
          >
            高度な
            <br />
            絞り込み
          </Button>
        </HStack>
      </HeaderBase>
      <MainBox>
        <Flex py="16px" alignItems="center" justifyContent="center">
          <Text fontSize="3xl" fontWeight="semibold" color="blue.500" mr="8">
            提供可能: {cookedOrdersLen}
          </Text>
          <Text fontSize="3xl" fontWeight="semibold" color="orange.700" mr="8">
            調理中: {cookingOrdersLen}
          </Text>
          <Text fontSize="3xl" fontWeight="semibold" color="gray.600">
            未調理: {notYetOrdersLen}
          </Text>
        </Flex>
        <Flex alignItems="flex-start">
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
