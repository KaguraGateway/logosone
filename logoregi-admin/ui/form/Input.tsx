'use client';

import { ChangeEvent } from 'react';
import { Box, Input as ChakraInput, Stack, Text } from '@chakra-ui/react';

type Props = {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  root?: React.ComponentProps<typeof Stack>;
};

export function Input(props: Props) {
  return (
    <Stack {...props.root}>
      <Text color="gray.500">{props.label}</Text>
      <ChakraInput value={props.value} onChange={props.onChange} placeholder={props.placeholder} />
    </Stack>
  );
}
