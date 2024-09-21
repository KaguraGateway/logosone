import { Badge, Button, Flex, Spacer, Text } from '@chakra-ui/react';

type Props = {
  name: string;
  quantity: number;
  stock?: number;
  onClick: () => void;
  isDisabled?: boolean;
};

export default function ProductInfoButton(props: Props) {
  const textColor = props.stock !== undefined && props.stock <= 3 ? 'red.500' : 'gray.500';

  return (
    <>
      <Button
        size="lg"
        bg="white"
        color="gray.600"
        whiteSpace="unset"
        width="100%"
        paddingY={4}
        boxShadow="base"
        border="1px"
        borderColor="gray.300"
        justifyContent="flex-start"
        onClick={props.onClick}
        isDisabled={props.isDisabled}
        height={'min-content'}
        minHeight={20}
        // onClickの動作は頼んだ
      >
        <Flex flexDir="column" width="100%" alignItems={'start'} gap={2}>
          <Flex flexDir="row" width="100%">
            <Text overflowWrap="break-word">{props.name}</Text>
            <Spacer />
            {props.quantity <= 0 ? (
              <Spacer />
            ) : (
              <Badge colorScheme="green">
                <Text fontSize="lg">{props.quantity}</Text>
              </Badge>
            )}
          </Flex>
          {props.stock === undefined ? (
            <></>
          ) : (
            <Text fontSize="sm" color={textColor}>
              在庫数：{props.stock}
            </Text>
          )}
        </Flex>
      </Button>
    </>
  );
}
