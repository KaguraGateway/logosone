import { Flex, Text } from '@chakra-ui/react';

type Props = {
  callNumber: string;
};

export function CallingOrderCard(props: Props) {
  return (
    <Flex
      bg="gray.50"
      border="2.5px solid"
      borderColor="teal.600"
      borderRadius="md"
      boxShadow="lg"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Text fontSize="2xl" fontWeight="bold" color="teal.600">
        {props.callNumber}
      </Text>
    </Flex>
  );
}
