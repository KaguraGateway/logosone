import { Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';

export default function Home() {
  return (
    <Flex flexDir="column" gap="26px">
      <Button as={Link} href="/waiter" size="lg" colorScheme="teal" h="100px">
        ホール業務
        <br />
        (注文・配膳)
      </Button>
    </Flex>
  );
}
