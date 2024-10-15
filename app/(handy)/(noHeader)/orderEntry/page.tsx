'use client';
import { Button, Center, Flex, Text } from '@chakra-ui/react';
import { Product, ProductType } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service_pb';
import Link from 'next/link';
import React, { useState, useRef } from 'react';
import { HiCheckCircle } from 'react-icons/hi';
import { IoArrowBackOutline } from 'react-icons/io5';

import ProductInfoCard from '../_components/ProductInfoCard';
import CategorySelectButton from './_components/CategorySelectButton';
import ChooseOptionModal from './_components/ChooseOptionModal';
import ProductInfoButton from './_components/ProductInfoButton';
import ProductQuantityControl from './_components/ProductQuantityControl';
import TicketNumberInputModal from './_components/TicketNumberInputModal';
import { useOrderEntryUseCase } from './usecase';

function OrderCheck({
  backToOrderEntry,
  onPostOrder,
  orderItems,
  getProductInfo,
  isOrderSending,
  currentSeatName,
}: ReturnType<typeof useOrderEntryUseCase>) {
  return (
    <>
      <Center>
        <Text fontSize="2xl" fontWeight="semibold" color="gray.600" p={4}>
          注文確認 - {currentSeatName}
        </Text>
      </Center>
      <Flex flexDir="column" padding={1} width="100%" gap={4} paddingX={4}>
        {orderItems.map((item) => {
          const { product, coffeeBrew } = getProductInfo(item.productId, item.coffeeBrewId);
          return (
            <ProductInfoCard
              key={`${item.productId}${item.coffeeBrewId}`}
              name={coffeeBrew != null ? `${product?.productName} (${coffeeBrew.name})` : product?.productName ?? ''}
              quantity={item.quantity}
            />
          );
        })}
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
          colorScheme="red"
          leftIcon={<IoArrowBackOutline />}
          marginRight={4}
          onClick={backToOrderEntry}
        >
          戻る
        </Button>
        <Button
          flex={3}
          size="lg"
          colorScheme="green"
          leftIcon={<HiCheckCircle />}
          onClick={onPostOrder}
          isLoading={isOrderSending}
        >
          注文送信
        </Button>
      </Flex>
    </>
  );
}

function OrderEntry({
  onConfirmSeatId,
  isOpenChooseOptionModal,
  onOpenChooseOptionModal,
  onCloseChooseOptionModal,
  isOpenTicketNumberInputModal,
  onOpenTicketNumberInputModal,
  onCloseTicketNumberInputModal,
  categories,
  onAddItem,
  onChangeQuantity,
  getQuantity,
  toOrderCheck,
}: ReturnType<typeof useOrderEntryUseCase>) {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const onOpenChooseOptionModalOverride = (product: Product) => {
    setCurrentProduct(product);
    onOpenChooseOptionModal();
  };

  const handleCategoryClick = (categoryName: string) => {
    const categoryRef = categoryRefs.current[categoryName];
    if (categoryRef) {
      categoryRef.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 全体 */}
      <Flex flexDir="row">
        {/* 左 */}
        <Flex flexDir="column" width={3 / 10} alignItems="start" overflow="scroll">
          {categories.map((category) => (
            <CategorySelectButton
              key={category.id}
              name={category.name}
              isSelected={false}
              onClick={() => handleCategoryClick(category.name)}
            />
          ))}
        </Flex>
        {/* 右 */}
        <Flex
          flexDir="column"
          width={7 / 10}
          alignItems="start"
          overflow="scroll"
          borderLeft="2px"
          borderColor="gray.300"
          paddingBottom={100}
        >
          {/* Category */}
          {categories.map((category) => (
            <Flex flexDir="column" padding={1} width="100%" gap={2} key={category.id} ref={(el) => (categoryRefs.current[category.name] = el)}>
              {/* CategoryName */}
              <Text fontSize="xl" fontWeight="semibold" color="gray.600">
                {category.name}
              </Text>
              {category.products.map((product) => {
                if (product.productType === ProductType.COFFEE) {
                  return (
                    <ProductInfoButton
                      key={product.productId}
                      name={product.productName}
                      quantity={getQuantity(product) ?? 0}
                      onClick={() => onOpenChooseOptionModalOverride(product)}
                    />
                  );
                } else {
                  return (
                    <ProductQuantityControl
                      key={product.productId}
                      name={product.productName}
                      quantity={getQuantity(product) ?? 0}
                      onClick={() => onAddItem(product)}
                      onQuantityChange={(newQuantity) => onChangeQuantity(product, newQuantity)}
                      stock={product.stock?.quantity ?? -1}
                    />
                  );
                }
              })}
            </Flex>
          ))}
        </Flex>
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
          colorScheme="red"
          leftIcon={<IoArrowBackOutline />}
          marginRight={4}
          as={Link}
          href="/waiter"
        >
          戻る
        </Button>
        <Button flex={3} size="lg" colorScheme="green" leftIcon={<HiCheckCircle />} onClick={toOrderCheck}>
          注文確認
        </Button>
      </Flex>
      <TicketNumberInputModal
        isOpen={isOpenTicketNumberInputModal}
        onClose={onCloseTicketNumberInputModal}
        onOpen={onOpenTicketNumberInputModal}
        onConfirm={onConfirmSeatId}
      />
      <ChooseOptionModal
        isOpen={isOpenChooseOptionModal}
        onClose={onCloseChooseOptionModal}
        onConfirm={(id) => {
          if (currentProduct == null) return;
          onAddItem(
            currentProduct,
            currentProduct.coffeeBrews.find((v) => v.id === id)
          );
        }}
        onQuantityChange={(id, newQuantity) => {
          if (currentProduct == null) return;
          onChangeQuantity(
            currentProduct,
            newQuantity,
            currentProduct.coffeeBrews.find((v) => v.id === id)
          );
        }}
        options={
          currentProduct?.coffeeBrews.map((v) => ({
            id: v.id,
            name: v.name,
            quantity: getQuantity(currentProduct, v) ?? 0,
          })) ?? []
        }
      />
    </>
  );
}

export default function Page() {
  const usecase = useOrderEntryUseCase();

  if (usecase.state === 0) {
    return <OrderEntry {...usecase} />;
  }
  return <OrderCheck {...usecase} />;
}
