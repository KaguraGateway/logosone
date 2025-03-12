'use client';

import {ComponentProps} from 'react';
import { Box } from '@chakra-ui/react';

type Props = ComponentProps<typeof Box> & {
  grow?: string | number;
};

export function Th(props: Props) {
  const { grow, ...rest } = props;
  
  return (
    <Box
      {...rest}
      style={{
        display: 'flex',
        flex: grow !== undefined ? `0 0 ${grow}` : '1 0 100px',
        overflow: 'hidden',
        minWidth: grow ? `${grow}px` : '100px',
        color: 'gray',
        padding: '0.5rem',
        fontWeight: 'bold',
        textAlign: 'left'
      }}
    />
  );
}
