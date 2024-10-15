import { Button, Text } from '@chakra-ui/react';

type Props = {
  name: string;
  isSelected: boolean;
  onClick: () => void; // onClickプロパティを追加
};

export default function CategorySelectButton(props: Props) {
  return (
    <>
    <Button
      size="lg"
      colorScheme={props.isSelected ? 'orange' : 'whiorangepha'}
      color={props.isSelected ? 'white' : 'gray.600'}
      whiteSpace="unset"
      width="100%"
      minHeight="80px"
      height="max-content"
      padding={1}
      borderRadius="0"
      borderY="1px"
      borderColor="gray.300"
      onClick={props.onClick}
    >
      <Text overflowWrap="anywhere">{props.name}</Text>
    </Button>
    </>
  );
}
