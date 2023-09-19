'use client';

import { Badge, Button, Flex, Text } from '@chakra-ui/react';

import { CancelButton } from '@/ui/CancelButton';

import { CookingDoneBox, CookingStartBox, CookingTakingBox } from './CookingStatusButton';

type Props = {
  callNumber: string;
  productName: string;
  subTtitle?: string;
  productColor: string;
  prefix: string;
  waitingTime: string;
  cookingStatus: 'notyet' | 'cooking' | 'done';
};

export function ItemInfoCard({
  callNumber,
  productName,
  subTtitle,
  prefix,
  waitingTime,
  cookingStatus,
  productColor,
}: Props) {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      px="12px"
      w="full"
      h="93px"
      bg={cookingStatus === 'notyet' ? 'white' : cookingStatus === 'cooking' ? 'orange.200' : 'green.200'}
      boxShadow="base"
      borderRadius="lg"
      mb="4"
    >
      <CancelButton mr="8" />
      <Button
        variant="unstyled"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        h="full"
        flex="1"
        border="none"
        outline="0"
      >
        <Text fontSize="3xl" fontWeight="semibold" color="gray.700">
          {callNumber}
        </Text>
        <Flex alignItems="center" ml="8" flex="1" maxW="300px" flexWrap="wrap">
          <Text fontSize="2xl" fontWeight="semibold" color={productColor}>
            {productName}
          </Text>
          <Text fontSize="2xl" fontWeight="semibold" color={productColor}>
            {subTtitle}
          </Text>
        </Flex>
        <Text fontSize="4xl" fontWeight="extrabold" color={productColor} w="26.4px">
          {prefix}
        </Text>
        <Flex mx="6" flexDirection="column">
          <Text fontSize="lg" fontWeight="medium" color="gray.600">
            {waitingTime}待ち
          </Text>
          <Badge
            bg={cookingStatus === 'notyet' ? 'gray.100' : cookingStatus === 'cooking' ? 'orange.500' : 'green.500'}
            color={cookingStatus === 'notyet' ? 'gray.800' : 'white'}
            variant="subtle"
            fontSize="xl"
            fontWeight="semibold"
            mt="2"
          >
            {cookingStatus === 'notyet' ? '未調理' : cookingStatus === 'cooking' ? '調理中' : '調理済'}
          </Badge>
        </Flex>
        {cookingStatus === 'notyet' ? (
          <CookingStartBox />
        ) : cookingStatus === 'cooking' ? (
          <CookingDoneBox />
        ) : (
          <CookingTakingBox />
        )}
      </Button>
    </Flex>
  );
}
