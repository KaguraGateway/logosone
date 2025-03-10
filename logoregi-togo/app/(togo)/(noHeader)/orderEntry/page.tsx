'use client';
import { Button, Center, Flex, Text } from '@chakra-ui/react';
import { Product, ProductType } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service_pb';
import Link from 'next/link';
import React, {Suspense, useEffect, useState} from 'react';
import { HiCheckCircle } from 'react-icons/hi';
import { IoArrowBackOutline } from 'react-icons/io5';

import ProductInfoCard from '../_components/ProductInfoCard';
import CategorySelectButton from './_components/CategorySelectButton';
import ChooseOptionModal from './_components/ChooseOptionModal';
import ProductInfoButton from './_components/ProductInfoButton';
import ProductQuantityControl from './_components/ProductQuantityControl';
import { useOrderEntryUseCase } from './usecase';

function OrderCheck({
  backToOrderEntry,
  onPostOrder,
  orderItems,
  getProductInfo,
  isOrderSending,
}: ReturnType<typeof useOrderEntryUseCase>) {
  return (
    <>
      <Center>
        <Text fontSize="2xl" fontWeight="semibold" color="gray.600" p={4}>
          注文確認
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categories[0]?.name || null);

  const onOpenChooseOptionModalOverride = (product: Product) => {
    setCurrentProduct(product);
    onOpenChooseOptionModal();
  };

  return (
    <>
      {/* 全体 */}
      <Flex flexDir="row">
        {/* 左側のカテゴリー */}
        <Flex
          flexDir="column"
          width="30%"
          alignItems="start"
          overflowY="auto"
          position="fixed"
          height="100%"
          bg="gray.100"
          borderRight="1px"
          borderColor="gray.300"
        >
          {categories.map((category) => (
            <CategorySelectButton
              key={category.id}
              name={category.name}
              isSelected={selectedCategory === category.name}
              onClick={() => {
                setSelectedCategory(category.name); // カテゴリを選択する処理
              }}
            />
          ))}
        </Flex>

        {/* 右側のコンテンツ */}
        <Flex
          flexDir="column"
          width="70%"
          marginLeft="30%"
          overflowY="auto"
          padding={4}
          marginBottom={70}
        >
          {/* Category */}
          {categories.map((category) => (
            <Flex flexDir="column" padding={1} width="100%" gap={2} key={category.id}>
              {/* CategoryName */}
              <Text fontSize="xl" fontWeight="semibold" color="gray.600">
                {category.name}
              </Text>
              {category.products.filter(product => product.isNowSales).map((product) => {
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
    return <Suspense><OrderEntry {...usecase} /></Suspense>
  }
  return <OrderCheck {...usecase} />;
}
