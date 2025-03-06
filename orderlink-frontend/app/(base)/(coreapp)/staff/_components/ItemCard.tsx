import { Box, Button, Checkbox, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { IconContext } from 'react-icons';
import { AiFillBell } from 'react-icons/ai';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { MdOutlineClear, MdOutlineDone } from 'react-icons/md';

import { rebuildMap } from '@/utils/rebuildMap';

import { OrderBadge } from './OrderBadge';

type ProductItem = {
  productId: string;
  productName: string;
  productColor: string;
  items: Array<{
    itemId: string;
    status: 'notyet' | 'done';
  }>;
};
type ProductItemProps = Omit<ProductItem, 'productId'> & {
  checkedItems: Map<string, boolean>;
  setCheckedItems: Dispatch<SetStateAction<Map<string, boolean>>>;
};

function ProductItem(props: ProductItemProps) {
  return (
    <Box w="full" borderBottom="1px" borderBottomColor="gray.300" pb="2">
      <Flex borderLeft="4px" borderLeftColor={props.productColor} pl="2">
        <Flex flexDirection="column" flex="1">
          {props.items.map((item) => (
            <Checkbox
              size="xl"
              key={item.itemId}
              isDisabled={item.status === 'notyet' ? true : false}
              isChecked={props.checkedItems.get(item.itemId)}
              onChange={() => {
                props.setCheckedItems((prev) => {
                  const newMap = rebuildMap(prev);
                  newMap.set(item.itemId, !prev.get(item.itemId));
                  return rebuildMap(newMap);
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
        </Flex>
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
  waitingTime: React.ReactNode;
  type: 'takeout' | 'eat-in';
  status: 'cooking' | 'calling' | 'provided';
  onCall: () => void;
  onCancelCall: () => void;
  onProvided: () => void;
  items: Array<{
    productId: string;
    productName: string;
    productColor: string;
    itemId: string;
    status: 'notyet' | 'done';
  }>;
};

export function ItemCard(props: ItemCardProps) {
  const products: Array<ProductItem> = useMemo(() => {
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
  const [checkedItems, setCheckedItems] = useState<Map<string, boolean>>(
    new Map<string, boolean>(products.flatMap((product) => product.items.map((item) => [item.itemId, false])))
  );
  const isAllChecked = Array.from(checkedItems.values()).every((value) => value);
  const isCalled = props.status === 'calling';

  let bgColor = 'white';
  if (props.type === 'eat-in' && isAllChecked) {
    bgColor = 'green.100';
  } else if (props.type === 'takeout' && isAllChecked) {
    bgColor = isCalled ? 'green.100' : 'yellow.100';
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
            key={product.productId}
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
        <Flex style={{ display: props.type === 'takeout' && isCalled ? '' : 'none' }}>
          <Button colorScheme="red" bg="red.500" mr="2" leftIcon={<MdOutlineClear />} onClick={props.onCancelCall}>
            取り消し
          </Button>
          <Button colorScheme="blue" bg="blue.500" flex={1} leftIcon={<MdOutlineDone />} onClick={props.onProvided}>
            提供完了
          </Button>
        </Flex>
        <Button
          w="full"
          colorScheme="orange"
          bg="orange.500"
          leftIcon={<AiFillBell />}
          style={{ display: props.type === 'takeout' && !isCalled ? '' : 'none' }}
          onClick={props.onCall}
        >
          呼び出し
        </Button>
        <Button
          colorScheme="blue"
          bg="blue.500"
          w="full"
          leftIcon={<MdOutlineDone />}
          style={{ display: props.type === 'eat-in' ? '' : 'none' }}
          onClick={props.onProvided}
        >
          提供完了
        </Button>
      </Box>
    </Box>
  );
}
