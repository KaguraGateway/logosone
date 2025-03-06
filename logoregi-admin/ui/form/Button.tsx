'use client';

import { Button as ChakraButton } from '@chakra-ui/react';

type ButtonVariantProps = {
  variant?: 'secondary' | 'success' | 'error';
  size?: 'md';
};

export function Button(props: React.ComponentProps<typeof ChakraButton> & ButtonVariantProps) {
  const { variant = 'secondary', size = 'md', ...rest } = props;
  return <ChakraButton variant={variant} size={size} {...rest} />;
}
