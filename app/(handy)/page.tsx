import { Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
    <Flex flexDir="column" gap="26px" mb="26px">
      <Button as={Link} href="/waiter" size="lg" colorScheme="teal" h="100px">
        ホール業務
        <br />
        (注文・配膳)
      </Button>
    </Flex>
    <Flex flexDir="row" gap="26px">
        <Button flex={1} as={Link} href="/kitchen" size="lg" colorScheme="blue" h="100px" bg="gray.500">
          OrderLink
          <br />
          (注文確認)
        </Button>
        <Button flex={1} as={Link} href="/kitchen" size="lg" colorScheme="blue" h="100px" bg="gray.500">
          OrderLink
          <br />
          WebCall
          <br />
          (呼出確認)
        </Button>
      </Flex>
      </>
  );
}
