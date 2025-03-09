'use client';

import { Flex, FlexProps } from '@chakra-ui/react';

export function TableHeader(props: FlexProps) {
  return (
    <Flex
      {...props}
      borderBottomWidth="1px"
      borderColor="gray.300"
      pb={2}
      mb={2}
    />
  );
}
