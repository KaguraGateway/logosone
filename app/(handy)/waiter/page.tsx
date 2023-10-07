import { Button, Flex } from "@chakra-ui/react";

export default function Waiter() {
  return (
    <Flex flexDir="column" gap="26px">
      <Button size="lg" colorScheme="teal" h="100px">
        ホール業務
        <br />
        (注文・配膳)
      </Button>
    </Flex>
  );
}
