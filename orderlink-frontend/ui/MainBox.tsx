import { Box } from '@chakra-ui/react';
import React from 'react';

export function MainBox(props: React.ComponentProps<typeof Box>) {
  return (
    <Box p="1.5rem" mt="80px" {...props}>
      {props.children}
    </Box>
  );
}
