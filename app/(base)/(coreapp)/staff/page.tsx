'use client';

import { Button, Flex, HStack, Text } from '@chakra-ui/react';
import { BiCoffeeTogo } from 'react-icons/bi';
import { FiCoffee } from 'react-icons/fi';
import { FiCheckSquare } from 'react-icons/fi';

import { HeaderBase } from '@/ui/HeaderBase';
import { MainBox } from '@/ui/MainBox';

import { ItemCard } from './_components/ItemCard';

export default function StaffPage() {
  return (
    <>
      <HeaderBase name="スタッフ">
        <HStack>
          <Button
            size="lg"
            colorScheme="orange"
            bg="orange.500"
            leftIcon={<BiCoffeeTogo />}
            fontSize="sm"
            textAlign="left"
          >
            テイクアウト
            <br />
            全件表示
          </Button>
          <Button size="lg" colorScheme="teal" bg="teal.500" leftIcon={<FiCoffee />} fontSize="sm" textAlign="left">
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
            提供可能: 4
          </Text>
          <Text fontSize="3xl" fontWeight="semibold" color="orange.700" mr="8">
            調理中: 2
          </Text>
          <Text fontSize="3xl" fontWeight="semibold" color="gray.600">
            未調理: 6
          </Text>
        </Flex>
        <Flex alignItems="flex-start">
          <ItemCard
            callNumber="L-101"
            seatNumber=""
            waitingTime="120分"
            type="takeout"
            items={[
              {
                productId: 'A',
                productName: 'ハルメリア（ネル）',
                productColor: 'yellow.600',
                itemId: 'A',
                status: 'done',
              },
              {
                productId: 'A',
                productName: 'ハルメリア（ネル）',
                productColor: 'yellow.600',
                itemId: 'B',
                status: 'done',
              },
            ]}
          />
          <ItemCard
            callNumber="L-101"
            seatNumber="テーブル99"
            waitingTime="240分"
            type="eat-in"
            items={[
              {
                productId: 'A',
                productName: 'ハルメリア（ネル）',
                productColor: 'yellow.600',
                itemId: 'A',
                status: 'done',
              },
              {
                productId: 'A',
                productName: 'ハルメリア（ネル）',
                productColor: 'yellow.600',
                itemId: 'B',
                status: 'done',
              },
            ]}
          />
        </Flex>
      </MainBox>
    </>
  );
}
