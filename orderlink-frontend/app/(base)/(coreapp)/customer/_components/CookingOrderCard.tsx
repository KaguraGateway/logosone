import { Flex, Text, VStack } from "@chakra-ui/react";

type Props = {
  callNumber: string;
  estimatedWaitingTime?: number; // 秒単位
};

export function CookingOrderCard(props: Props) {
  return (
    <Flex bg="gray.50" w="177px" h="80px" borderRadius="md" boxShadow="lg" justifyContent="center" alignItems="center">
      <VStack spacing={0}>
        <Text fontSize="5xl" fontWeight="bold" color="gray.600">{props.callNumber}</Text>
        {props.estimatedWaitingTime !== undefined && (
          <Text fontSize="md" fontWeight="bold" color="gray.500">
            あと約{Math.ceil(props.estimatedWaitingTime / 60)}分
          </Text>
        )}
      </VStack>
    </Flex>
  );
}
