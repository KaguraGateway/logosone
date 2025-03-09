'use client';

import { Button as ChakraButton } from '@chakra-ui/react';

type ButtonVariantProps = {
  variant?: 'outline' | 'solid' | 'subtle' | 'surface' | 'ghost' | 'plain';
  colorScheme?: string;
  size?: 'md';
};

export function Button(props: React.ComponentProps<typeof ChakraButton> & ButtonVariantProps) {
  const { variant = 'solid', colorScheme = 'gray', size = 'md', ...rest } = props;
  return <ChakraButton variant={variant} colorScheme={colorScheme} size={size} {...rest} />;
}
