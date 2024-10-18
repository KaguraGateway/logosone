import { Button, Text } from '@chakra-ui/react';

type Props = {
  name: string;
  isSelected: boolean;
};

export default function CategorySelectButton(props: Props) {
  return (
    <>
      <Button
        size="lg"
        {...(props.isSelected ? { colorScheme: 'teal' } : { colorScheme: 'whiteAlpha', color: 'gray.600' })}
        whiteSpace="unset"
        width="100%"
        minHeight="80px"
        height="max-content"
        padding={1}
        borderRadius="0"
        borderY="1px"
        borderColor="gray.300"
        onClick={() => {}}
        // onClickの動作は頼んだ
      >
        <Text overflowWrap="anywhere">{props.name}</Text>
      </Button>
    </>
  );
}
