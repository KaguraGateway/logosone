import { Box } from '@chakra-ui/react';
import type React from 'react';

export function MainBox(props: React.ComponentProps<typeof Box>) {
  return (
    <Box p={{ base: '1rem', md: '1.5rem' }} mt="80px" {...props}>
      {props.children}
    </Box>
  );
}
