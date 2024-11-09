import { Flex, Text } from "@chakra-ui/react";

type Props = {
  callNumber: string;
};

export function CookingOrderCard(props: Props) {
  return (
    <Flex bg="gray.50" borderRadius="md" boxShadow="lg" justifyContent="center" alignItems="center" px={2}>
      <Text fontSize="2xl" fontWeight="semibold" color="gray.600">{props.callNumber}</Text>
    </Flex>
  );
}
