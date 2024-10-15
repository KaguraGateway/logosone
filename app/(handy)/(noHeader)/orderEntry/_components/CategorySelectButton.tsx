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
      {...(props.isSelected ? { colorScheme: 'orange' } : { colorScheme: 'whiorangepha', color: 'gray.600' })}
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
