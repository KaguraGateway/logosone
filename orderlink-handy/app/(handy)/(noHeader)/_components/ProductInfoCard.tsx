import { Badge, Box, Flex, Spacer, Text } from '@chakra-ui/react';

type Props = {
  name: string;
  quantity: number;
};

export default function ProductInfoCard(props: Props) {
  return (
    <>
      <Box
        bg="white"
        color="gray.600"
        whiteSpace="unset"
        width="100%"
        paddingY={8}
        boxShadow="base"
        border="1px"
        borderColor="gray.300"
        justifyContent="flex-start"
        borderRadius={'6px'}
        padding={6}
        fontSize={'lg'}
        fontWeight={'semibold'}
      >
        <Flex flexDir="row" width="100%">
          <Text overflowWrap="anywhere">{props.name}</Text>
          <Spacer />
          {props.quantity <= 0 ? (
            <Spacer />
          ) : (
            <Badge colorScheme="green">
              <Text fontSize="lg">{props.quantity}</Text>
            </Badge>
          )}
        </Flex>
      </Box>
    </>
  );
}
