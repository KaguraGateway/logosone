'use client';

import { Box } from '@chakra-ui/react';

type TableProps = React.ComponentProps<'table'>;

export function Table(props: TableProps) {
  return (
    <Box overflowX="auto">
      <table {...props} style={{ width: '100%', borderCollapse: 'collapse' }} />
    </Box>
  );
}
