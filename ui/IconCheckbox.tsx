import { Checkbox, Flex } from '@chakra-ui/react';

type Props = React.ComponentProps<typeof Checkbox> & {
  leftIcon: React.ReactNode;
};

export function IconCheckbox({ leftIcon, ...props }: Props) {
  return (
    <Checkbox {...props}>
      <Flex alignItems="center">
        {leftIcon}
        {props.children}
      </Flex>
    </Checkbox>
  );
}
