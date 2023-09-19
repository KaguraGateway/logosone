import { Flex } from '@chakra-ui/react';
import React from 'react';

type Props = React.ComponentProps<typeof Flex>;
export function CookingStatusButton(props: Props) {
  return (
    <Flex px="4" py="2" color="white" boxShadow="base" borderRadius="lg" minH="64px" alignItems="center" {...props}>
      {props.children}
    </Flex>
  );
}

export function CookingStartBox() {
  return (
    <CookingStatusButton bg="yellow.600">
      調理
      <br />
      開始
    </CookingStatusButton>
  );
}

export function CookingDoneBox() {
  return (
    <CookingStatusButton bg="green.500">
      調理
      <br />
      完了
    </CookingStatusButton>
  );
}

export function CookingTakingBox() {
  return (
    <CookingStatusButton boxShadow="none" bg="0" border="1px" borderColor="green.700" color="green.700" px="1">
      提供中
    </CookingStatusButton>
  );
}
