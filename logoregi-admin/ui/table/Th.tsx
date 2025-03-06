'use client';

import { Th as ChakraTh } from '@chakra-ui/react';

type Props = React.ComponentProps<typeof ChakraTh> & {
  grow?: string | number;
};

export function Th(props: Props) {
  const { grow, ...rest } = props;
  
  return (
    <ChakraTh 
      {...rest}
      sx={{
        display: 'flex',
        flex: grow !== undefined ? `0 0 ${grow}` : '1 0 100px',
        overflow: 'hidden',
        minWidth: grow ?? '100px',
        color: 'gray.500',
      }}
    />
  );
}
