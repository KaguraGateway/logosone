'use client';

import { Box } from '@chakra-ui/react';

type Props = React.ComponentProps<'td'> & {
  grow?: string | number;
};

export function Td(props: Props) {
  const { grow, ...rest } = props;
  
  return (
    <td 
      {...rest}
      style={{
        display: 'flex',
        alignItems: 'center',
        flex: grow !== undefined ? `0 0 ${grow}` : '1 0 100px',
        overflow: 'hidden',
        minWidth: grow ? `${grow}px` : '100px',
        padding: '0.5rem'
      }}
    />
  );
}
