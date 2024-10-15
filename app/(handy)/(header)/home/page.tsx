import { Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
    <Flex flexDir="column" gap="26px" mb="26px">
      <Button as={Link} href="/staffSelection" size="lg" colorScheme="orange" h="100px" bg={"orange.700"}>
        ホール業務
        <br />
        (注文・配膳)
      </Button>
    </Flex>
      </>
  );
}
