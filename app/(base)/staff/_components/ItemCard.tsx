import { Box, Button, Checkbox, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { IconContext } from 'react-icons';
import { AiFillBell } from 'react-icons/ai';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { MdOutlineClear, MdOutlineDone } from 'react-icons/md';

import { OrderBadge } from './OrderBadge';

type ProductItemProps = {
  productName: string;
  productColor: string;
  items: Array<{
    itemId: string;
    status: 'notyet' | 'done';
  }>;
  checkedItems: Array<boolean>;
  setCheckedItems: Dispatch<SetStateAction<boolean[]>>;
};

function ProductItem(props: ProductItemProps) {
  return (
    <Box w="full" borderBottom="1px" borderBottomColor="gray.300" pb="2">
      <Flex borderLeft="4px" borderLeftColor={props.productColor} pl="2">
        <Box flex="1">
          {props.items.map((item, index) => (
            <Checkbox
              size="lg"
              key="item"
              isDisabled={item.status === 'notyet' ? true : false}
              isChecked={props.checkedItems[index]}
              onChange={() => {
                props.setCheckedItems((prev) => {
                  const newCheckedItems = [...prev];
                  newCheckedItems[index] = !newCheckedItems[index];
                  return newCheckedItems;
                });
              }}
            >
              <Flex alignItems="center">
                {item.status === 'done' ? (
                  <IconContext.Provider value={{ size: '1.5rem', color: 'green' }}>
                    <HiCheckCircle />
                  </IconContext.Provider>
                ) : (
                  <IconContext.Provider value={{ size: '1.5rem', color: 'red' }}>
                    <HiXCircle />
                  </IconContext.Provider>
                )}
                <Text fontSize="xl" fontWeight="semibold" color={props.productColor} ml="1">
                  {props.productName}
                </Text>
              </Flex>
            </Checkbox>
          ))}
        </Box>
        <Text alignSelf="flex-end" fontSize="xl" fontWeight="semibold" color="gray.600">
          x{props.items.length}
        </Text>
      </Flex>
    </Box>
  );
}

type ItemCardProps = {
  callNumber: string;
  seatNumber?: string;
  waitingTime: string;
  type: 'takeout' | 'eat-in';
  items: Array<{
    productId: string;
    productName: string;
    productColor: string;
    itemId: string;
    status: 'notyet' | 'done';
  }>;
};

export function ItemCard(props: ItemCardProps) {
  const products = useMemo(() => {
    const map = new Map();
    props.items.forEach((item) => {
      if (!map.has(item.productId)) {
        map.set(item.productId, {
          productId: item.productId,
          productName: item.productName,
          productColor: item.productColor,
          items: [],
        });
      }
      map.get(item.productId).items.push({
        itemId: item.itemId,
        status: item.status,
      });
    });
    return Array.from(map.values());
  }, [props.items]);
  const [checkedItems, setCheckedItems] = useState<Array<boolean>>(
    products.flatMap((product) => product.items.map(() => false))
  );
  const isAllChecked = checkedItems.every(Boolean);

  let bgColor = "white";
  if(props.type === 'eat-in' && isAllChecked) {
    bgColor = "yellow.100";
  } else if(props.type === 'takeout' && isAllChecked) {
    bgColor = "green.100";
  }

  return (
    <Box w="364px" px="3" py="4" bg={bgColor} borderRadius="md" boxShadow="base">
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize="3xl" fontWeight="semibold" color="gray.700">
          {props.callNumber}
        </Text>
        <HStack>
          <Text fontSize="md" fontWeight="semibold" color="gray.600" mr="2">
            {props.seatNumber}
          </Text>
          <Flex flexDirection="column" alignItems="center">
            <Text fontSize="sm" fontWeight="medium" color="gray.600" mb="0.5">
              {props.waitingTime}待ち
            </Text>
            <OrderBadge type={props.type} />
          </Flex>
        </HStack>
      </Flex>
      <VStack mt="4">
        {products.map((product) => (
          <ProductItem
            key={product.productName}
            productName={product.productName}
            productColor={product.productColor}
            items={product.items}
            checkedItems={checkedItems}
            setCheckedItems={setCheckedItems}
          />
        ))}
      </VStack>
      <Flex alignItems="center" justifyContent="space-between" pt="4">
        <Text fontSize="xl" fontWeight="semibold" color="gray.600">
          合計点数
        </Text>
        <Text fontSize="xl" fontWeight="semibold" color="gray.600">
          x{props.items.length}
        </Text>
      </Flex>
      <Box mt="4" style={{ display: isAllChecked ? '' : 'none' }}>
        <Flex style={{ display: props.type === 'eat-in' ? '' : 'none' }}>
          <Button colorScheme="red" bg="red.500" mr="2" leftIcon={<MdOutlineClear />}>
            取り消し
          </Button>
          <Button colorScheme="blue" bg="blue.500" flex={1} leftIcon={<MdOutlineDone />}>
            提供完了
          </Button>
        </Flex>
        <Button
          w="full"
          colorScheme="orange"
          bg="orange.500"
          leftIcon={<AiFillBell />}
          style={{ display: props.type === 'eat-in' ? 'none' : '' }}
        >
          呼び出し
        </Button>
      </Box>
    </Box>
  );
}
