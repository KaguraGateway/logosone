import { Flex } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

import Logo from '@/svg/header_logo.svg';

export function Header() {
  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      right="0"
      h="60px"
      px="12px"
      bg="white"
      boxShadow="lg"
      justifyContent="center"
      alignItems="center"
      zIndex={100}
    >
      <Link href="/waiter">
        <Logo />
      </Link>
    </Flex>
  );
}
