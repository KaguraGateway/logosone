import { Flex, Text } from "@chakra-ui/react";

type Props = {
  callNumber: string;
};

export function CookingOrderCard(props: Props) {
  return (
    <Flex bg="gray.50" w="177px" h="62px" borderRadius="md" boxShadow="lg" justifyContent="center" alignItems="center">
      <Text fontSize="5xl" fontWeight="bold" color="gray.600">{props.callNumber}</Text>
    </Flex>
  );
}
