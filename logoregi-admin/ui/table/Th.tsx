'use client';

import { Box } from '@chakra-ui/react';

type Props = React.ComponentProps<'th'> & {
  grow?: string | number;
};

export function Th(props: Props) {
  const { grow, ...rest } = props;
  
  return (
    <th 
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
