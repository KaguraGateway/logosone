import { Flex, Text } from '@chakra-ui/react';

type Props = {
  callNumber: string;
};

export function CallingOrderCard(props: Props) {
  return (
    <Flex
      w="277px"
      h="124px"
      bg="gray.50"
      border="4px"
      borderColor="teal.600"
      borderRadius="md"
      boxShadow="lg"
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize="6xl" fontWeight="bold" color="teal.600">
        {props.callNumber}
      </Text>
    </Flex>
  );
}
