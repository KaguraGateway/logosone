import { Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
    <Flex flexDir="column" gap="26px" mb="26px">
      ご来店ありがとうございます
      <Button as={Link} href="/orderEntry" size="lg" colorScheme="orange" h="100px" bg={"orange.700"}>
        注文入力
      </Button>
    </Flex>
      </>
  );
}
