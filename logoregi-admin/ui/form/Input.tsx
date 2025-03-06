import { ChangeEvent } from 'react';
import { FormControl, FormLabel, Input as ChakraInput, Stack } from '@chakra-ui/react';

type Props = {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  root?: React.ComponentProps<typeof Stack>;
};

export function Input(props: Props) {
  return (
    <FormControl as={Stack} {...props.root}>
      <FormLabel color="gray.500">{props.label}</FormLabel>
      <ChakraInput value={props.value} onChange={props.onChange} placeholder={props.placeholder} />
    </FormControl>
  );
}
