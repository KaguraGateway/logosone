'use client';

import { Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';

import LogoSvg from '@/svg/logo.svg';

export default function Home() {
  return (
    <Flex w="100vw" h="100vh" flexDirection="column" alignItems="center" justifyContent="center">
      <LogoSvg />
      <Flex flexDirection="column" bg="white" boxShadow="md" mt="48px" p="77px">
        <Button as={Link} href="/staff" bgColor="orange.300" color="orange.700" size="logos" mb="77px">
          スタッフ
        </Button>
        <Button as={Link} href="/kitchen" bgColor="orange.500" color="white" size="logos" mb="77px">
          キッチン
        </Button>
        <Button as={Link} href="/customer" bgColor="teal.500" color="white" size="logos" fontSize="5xl">
          カスタマーモニター
        </Button>
      </Flex>
    </Flex>
  );
}
